"""Install / refresh the Frappe HR onboarding journey.

Creates (or updates) a "Custom HTML Block" from the sibling block.html/css/js
files and mounts it as the primary content of the HR Setup workspace — the
landing workspace the Frappe HR app icon routes to.

Re-runnable. After editing block.html/css/js, apply with:

    bench --site <site> execute hrms.onboarding.install.apply
"""

import json
import os

import frappe

BLOCK_NAME = "HR Onboarding"
WORKSPACE = "HR Setup"
CONTENT_BLOCK_ID = "hrOnbBlock1"


def _read(fname: str) -> str:
	path = os.path.join(os.path.dirname(__file__), fname)
	with open(path, encoding="utf-8") as f:
		return f.read()


def _upsert_custom_block() -> None:
	html, style, script = _read("block.html"), _read("block.css"), _read("block.js")
	if frappe.db.exists("Custom HTML Block", BLOCK_NAME):
		doc = frappe.get_doc("Custom HTML Block", BLOCK_NAME)
	else:
		doc = frappe.new_doc("Custom HTML Block")
		doc.name = BLOCK_NAME
	doc.html = html
	doc.style = style
	doc.script = script
	doc.private = 0  # visible to everyone who can see the workspace
	doc.set("roles", [])  # no role restriction
	doc.save(ignore_permissions=True)


def _mount_in_workspace() -> None:
	ws = frappe.get_doc("Workspace", WORKSPACE)
	content = json.loads(ws.content or "[]")

	# already mounted? (idempotent)
	has_block = any(
		b.get("type") == "custom_block" and b.get("data", {}).get("custom_block_name") == BLOCK_NAME
		for b in content
	)
	if not has_block:
		block = {
			"id": CONTENT_BLOCK_ID,
			"type": "custom_block",
			"data": {"custom_block_name": BLOCK_NAME, "col": 12},
		}
		# keep the existing "Reports & Masters" cards, but lead with onboarding
		content = [block, *content]
		ws.content = json.dumps(content)

	# register in the workspace's custom_blocks child table
	if not any(r.custom_block_name == BLOCK_NAME for r in ws.custom_blocks):
		ws.append("custom_blocks", {"custom_block_name": BLOCK_NAME, "label": BLOCK_NAME})

	ws.save(ignore_permissions=True)


def apply() -> None:
	_upsert_custom_block()
	_mount_in_workspace()
	frappe.db.commit()
	frappe.clear_cache()
	print(f"✓ '{BLOCK_NAME}' mounted on '{WORKSPACE}' workspace")


def diag() -> None:
	blk = frappe.db.exists("Custom HTML Block", BLOCK_NAME)
	print("block doc exists:", bool(blk))
	if blk:
		doc = frappe.get_doc("Custom HTML Block", BLOCK_NAME)
		print(
			"  html len:",
			len(doc.html or ""),
			"| css len:",
			len(doc.style or ""),
			"| js len:",
			len(doc.script or ""),
		)
		print("  private:", doc.private, "| roles:", len(doc.get("roles") or []))
	content = frappe.db.get_value("Workspace", WORKSPACE, "content") or ""
	print(
		"workspace content has block:",
		BLOCK_NAME in content,
		"| block is first:",
		content.find(CONTENT_BLOCK_ID) < 60,
	)
	rows = frappe.get_all("Workspace Custom Block", filters={"parent": WORKSPACE}, pluck="custom_block_name")
	print("custom_blocks child rows:", rows)
	# render path used by the desk
	try:
		page = frappe.get_doc("Workspace", WORKSPACE)
		print("workspace loads via ORM OK | standard:", page.standard, "| app:", page.app)
	except Exception as e:
		print("workspace ORM ERROR:", repr(e)[:200])


def remove() -> None:
	"""Undo: detach the block from the workspace and delete the Custom HTML Block."""
	ws = frappe.get_doc("Workspace", WORKSPACE)
	content = [
		b
		for b in json.loads(ws.content or "[]")
		if not (b.get("type") == "custom_block" and b.get("data", {}).get("custom_block_name") == BLOCK_NAME)
	]
	ws.content = json.dumps(content)
	ws.custom_blocks = [r for r in ws.custom_blocks if r.custom_block_name != BLOCK_NAME]
	ws.save(ignore_permissions=True)
	if frappe.db.exists("Custom HTML Block", BLOCK_NAME):
		frappe.delete_doc("Custom HTML Block", BLOCK_NAME, ignore_permissions=True)
	frappe.db.commit()
	frappe.clear_cache()
	print(f"✓ removed '{BLOCK_NAME}' from '{WORKSPACE}'")
