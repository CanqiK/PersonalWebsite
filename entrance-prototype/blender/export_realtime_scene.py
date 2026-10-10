"""Export the approved office as a compact, dark real-time GLB proof.

The source .blend is opened read-only. Static geometry is baked and merged by
material; Canqi, the dialog workers, and aisle walkers remain separate for animation.
"""

import bpy
import json
import math
from collections import defaultdict
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "canqi-office-facing-styled.blend"
OUT = ROOT / "realtime"
OUT.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
scene = bpy.context.scene
assert scene.camera and (scene.render.resolution_x, scene.render.resolution_y) == (1280, 720)

# Low reflectance surfaces create the requested deep-blue shadows. The warm
# screen faces and a few cool edges remain legible against this base.
palette = {
    "Office | blue charcoal carpet": (0.010, 0.018, 0.030),
    "Office | alternating carpet": (0.016, 0.026, 0.041),
    "Office | grey green partitions": (0.087, 0.105, 0.103),
    "Office | partition edges": (0.115, 0.140, 0.140),
    "Architecture | graphite metal": (0.018, 0.025, 0.034),
    "Architecture | acoustic ceiling": (0.009, 0.015, 0.025),
    "Office | desktop": (0.037, 0.043, 0.041),
    "Office | paper": (0.27, 0.275, 0.25),
    "Office | inactive CRT": (0.023, 0.051, 0.060),
    "Office | amber lamps": (0.95, 0.41, 0.075),
    "Office | warm ceiling lights": (0.70, 0.52, 0.30),
    "People | skin": (0.155, 0.155, 0.145),
    "People | hair": (0.012, 0.016, 0.022),
    "People | navy suit": (0.019, 0.028, 0.041),
    "People | shirt": (0.14, 0.16, 0.16),
    "CANQI | worn black trench cloth": (0.024, 0.029, 0.040),
    "CANQI | lighter cloth facets": (0.041, 0.049, 0.061),
    "CANQI | dark seams and folds": (0.009, 0.014, 0.022),
    "CANQI | rounded soft fur cap": (0.018, 0.024, 0.033),
    "CANQI | black leather bird mask": (0.055, 0.068, 0.082),
    "CANQI | pewter goggle rim": (0.16, 0.175, 0.18),
    "CANQI | dark goggle glass": (0.004, 0.009, 0.018),
    "CANQI | charcoal woven scarf": (0.025, 0.030, 0.041),
    "CANQI | muted ochre shoulder strap": (0.31, 0.20, 0.078),
    "CANQI | worn boots": (0.013, 0.017, 0.024),
    "CANQI | bag stitching": (0.15, 0.13, 0.088),
}
for material in bpy.data.materials:
    if not material.use_nodes:
        continue
    principled = material.node_tree.nodes.get("Principled BSDF")
    if not principled:
        continue
    color = palette.get(material.name)
    if color is None:
        color = tuple(material.diffuse_color[:3])
    base = principled.inputs["Base Color"]
    for link in list(base.links):
        material.node_tree.links.remove(link)
    base.default_value = (*color, 1)
    material.diffuse_color = (*color, 1)
    principled.inputs["Metallic"].default_value = 0.05 if "metal" in material.name.lower() else 0
    principled.inputs["Roughness"].default_value = 0.84
    emission = 1.3 if "amber lamps" in material.name else 0.75 if "warm ceiling lights" in material.name else 0
    principled.inputs["Emission Color"].default_value = (*color, 1)
    principled.inputs["Emission Strength"].default_value = emission

character = bpy.data.objects["CANQI | Supplied character mesh"]
selected_worker_names = [".062", ".005", ".066", ".007", ".006"]


def smoothstep(value):
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


# Bake the saved pocket/head pose, then split the single imported mesh into
# independent animation regions. Only the chest receives a breathing morph.
depsgraph = bpy.context.evaluated_depsgraph_get()
posed = character.evaluated_get(depsgraph)
posed_mesh = posed.to_mesh(preserve_all_data_layers=True, depsgraph=depsgraph)
transform = posed.matrix_world.copy()
world_points = [transform @ vert.co for vert in posed_mesh.vertices]
raw_points = [vert.co.copy() for vert in posed_mesh.vertices]
raw_min_y = min(point.y for point in raw_points)
raw_center_x = (min(point.x for point in raw_points) + max(point.x for point in raw_points)) / 2
scale = (transform.to_3x3() @ Vector((0, 1, 0))).length

# Use the saved cap geometry to locate the neck pivot without changing its shape.
cap_material = next(i for i, mat in enumerate(posed_mesh.materials) if "rounded soft fur cap" in mat.name)
cap_vertices = {i for poly in posed_mesh.polygons if poly.material_index == cap_material for i in poly.vertices}
upper_cap = [world_points[i] for i in cap_vertices if world_points[i].z > 5.03]
cap_x = sum(point.x for point in upper_cap) / len(upper_cap)
cap_y = sum(point.y for point in upper_cap) / len(upper_cap)
# Preserve the approved cap silhouette instead of layering another crown on it.

part_faces = {name: [] for name in ("head", "chest", "left arm", "right arm", "lower")}
for poly in posed_mesh.polygons:
    local = sum((raw_points[i] for i in poly.vertices), Vector()) / len(poly.vertices)
    height = (local.y - raw_min_y) * scale
    lateral = (local.x - raw_center_x) * scale
    material_name = posed_mesh.materials[poly.material_index].name
    head_material = any(label in material_name for label in ("fur cap", "bird mask", "goggle"))
    if head_material:
        part = "head"
    elif "scarf" in material_name or "shoulder strap" in material_name:
        part = "chest"
    elif .81 <= height < 1.545 and lateral < -.265:
        part = "left arm"
    elif .81 <= height < 1.545 and lateral > .265:
        part = "right arm"
    elif .82 <= height < 1.545:
        part = "chest"
    else:
        part = "lower"
    part_faces[part].append(poly)

chest_points = [world_points[i] for poly in part_faces["chest"] for i in poly.vertices]
chest_centre = Vector((sum(p.x for p in chest_points) / len(chest_points),
                       sum(p.y for p in chest_points) / len(chest_points), 4.52))
pivots = {
    "head": Vector((cap_x, cap_y, 4.87)),
    "chest": chest_centre,
    "left arm": chest_centre + Vector((-.27, 0, -.04)),
    "right arm": chest_centre + Vector((.27, 0, -.04)),
    "lower": Vector((0, 0, 0)),
}
parts = []
for name, faces in part_faces.items():
    pivot = pivots[name]
    original_indices = sorted({i for poly in faces for i in poly.vertices})
    remap = {original: local for local, original in enumerate(original_indices)}
    data = bpy.data.meshes.new("CANQI runtime | " + name)
    data.from_pydata([tuple(world_points[i] - pivot) for i in original_indices], [],
                     [tuple(remap[i] for i in poly.vertices) for poly in faces])
    data.update()
    for material in posed_mesh.materials:
        data.materials.append(material)
    for new_poly, old_poly in zip(data.polygons, faces):
        new_poly.material_index = old_poly.material_index
    obj = bpy.data.objects.new("CANQI | " + name, data)
    scene.collection.objects.link(obj)
    obj.location = pivot
    if name == "chest":
        obj.shape_key_add(name="Basis", from_mix=False)
        inhale = obj.shape_key_add(name="Chest inhale", from_mix=False)
        for local, original in enumerate(original_indices):
            world = world_points[original]
            lateral = abs((raw_points[original].x - raw_center_x) * scale)
            low = smoothstep((world.z - 4.17) / .18)
            high = smoothstep((4.90 - world.z) / .20)
            side = smoothstep((.315 - lateral) / .13)
            weight = low * high * side
            radial = Vector((world.x - chest_centre.x, world.y - chest_centre.y, 0))
            offset = radial * (.105 * weight) + Vector((0, 0, .006 * weight))
            inhale.data[local].co = data.vertices[local].co + offset
        inhale.value = 0
    parts.append(obj)

posed.to_mesh_clear()

moving = set(parts)
for suffix in selected_worker_names:
    moving.add(bpy.data.objects["Worker head" + suffix])
    moving.add(bpy.data.objects["Worker hair" + suffix])

# The supplied worker meshes are individual body parts. Keep five workers in
# the clear aisles together so the browser can move them without moving desks.
walkers = []
walker_limb_pivots = []
for number, (x, y) in enumerate([(-7.2, 7.7), (-7.2, 25), (-2.4, 28),
                                (-7.1, 15), (-2.4, 12)]):
    pivot = bpy.data.objects.new(f"Walking worker {number + 1}", None)
    scene.collection.objects.link(pivot)
    pivot.location = (x, y, 0)
    scene.view_layers[0].update()
    parts_to_walk = []
    for obj in scene.objects:
        if obj.type != "MESH" or not obj.name.startswith("Worker "):
            continue
        # Tube meshes bake their points into mesh space and keep an origin at
        # (0, 0, 0), so the object origin cannot identify the worker.
        centre = sum((obj.matrix_world @ Vector(corner) for corner in obj.bound_box), Vector()) / 8
        if abs(centre.x - x) < .53 and abs(centre.y - y) < .56:
            parts_to_walk.append(obj)
    assert len(parts_to_walk) >= 12 and any(obj.name.startswith("Worker head") for obj in parts_to_walk), (x, y, len(parts_to_walk))
    for obj in parts_to_walk:
        original = obj.matrix_world.copy()
        obj.parent = pivot
        obj.matrix_world = original
        moving.add(obj)
    for side, sign in (("left", -1), ("right", 1)):
        for limb, height in (("leg", .88), ("arm", 1.31)):
            joint = bpy.data.objects.new(f"Walking worker {number + 1} {side} {limb}", None)
            scene.collection.objects.link(joint)
            joint.location = (x + sign * (.085 if limb == "leg" else .19), y, height)
            bpy.context.view_layer.update()
            original_joint = joint.matrix_world.copy()
            joint.parent = pivot
            joint.matrix_world = original_joint
            for obj in parts_to_walk:
                if limb == "leg" and not obj.name.startswith(("Worker trousers", "Worker shoe")):
                    continue
                if limb == "arm" and not obj.name.startswith(("Worker jacket sleeve", "Worker hand")):
                    continue
                centre = sum((obj.matrix_world @ Vector(corner) for corner in obj.bound_box), Vector()) / 8
                if (centre.x - x) * sign <= 0:
                    continue
                original = obj.matrix_world.copy()
                obj.parent = joint
                obj.matrix_world = original
            walker_limb_pivots.append(joint)
    walkers.append(pivot)

# Raise the camera and move toward the railing to reduce foreground balcony.
camera_forward = scene.camera.matrix_world.to_quaternion() @ Vector((0, 0, -1))
scene.camera.location -= camera_forward * .25
scene.camera.location.z += .38
from mathutils import Quaternion
scene.camera.rotation_euler = (scene.camera.rotation_euler.to_quaternion() @ Quaternion((1, 0, 0), math.radians(-3))).to_euler()
bpy.context.view_layer.update()

groups = defaultdict(lambda: {"vertices": [], "faces": [], "material": None})
split_materials = {}
depsgraph = bpy.context.evaluated_depsgraph_get()
static_count = 0
for obj in list(scene.objects):
    if obj.type != "MESH" or obj in moving or obj == character:
        continue
    front_screen = None
    if obj.name.startswith("Amber task screen face"):
        centre = obj.matrix_world.translation
        row = round((centre.y - 4.767) / 4.30)
        columns = [-9.2, -4.3, .1, 4.5]
        column = min(range(4), key=lambda i: abs(centre.x - columns[i]))
        if 0 <= row < 4 and abs(centre.y - (4.767 + row * 4.30)) < .06 and abs(centre.x - columns[column]) < .06:
            front_screen = f"front r{row} c{column}"
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    if not mesh:
        continue
    transform = evaluated.matrix_world
    by_material = defaultdict(list)
    for poly in mesh.polygons:
        slot = poly.material_index
        material = obj.material_slots[slot].material if slot < len(obj.material_slots) else None
        if material and material.name.startswith("City | window "):
            centre = sum((transform @ mesh.vertices[i].co for i in poly.vertices), Vector()) / len(poly.vertices)
            # Eight interleaved banks let window clusters glow independently.
            bank = (math.floor(centre.x * 1.1) + 3 * math.floor(centre.y * .9)
                    + 5 * math.floor(centre.z * 1.1)) % 8
            key = (slot, bank)
        else:
            key = (slot, None)
        by_material[key].append(tuple(poly.vertices))
    for (slot, bank), faces in by_material.items():
        material = obj.material_slots[slot].material if slot < len(obj.material_slots) else None
        key = material.name if material else "Runtime | unassigned"
        if bank is not None:
            key += f" | bank {bank}"
        elif front_screen and material and material.name == "Office | amber lamps":
            key += f" | {front_screen}"
        if key != (material.name if material else "Runtime | unassigned") and key not in split_materials:
            split_materials[key] = material.copy()
            split_materials[key].name = key
        group = groups[key]
        group["material"] = split_materials.get(key, material)
        start = len(group["vertices"])
        group["vertices"].extend(tuple(transform @ vertex.co) for vertex in mesh.vertices)
        group["faces"].extend(tuple(start + vertex for vertex in face) for face in faces)
    evaluated.to_mesh_clear()
    static_count += 1

bpy.ops.object.select_all(action="DESELECT")
export_objects = []
for name, group in groups.items():
    data = bpy.data.meshes.new("Runtime merged | " + name)
    data.from_pydata(group["vertices"], [], group["faces"])
    data.update()
    material = group["material"]
    if material:
        data.materials.append(material)
    obj = bpy.data.objects.new("Runtime | " + name, data)
    scene.collection.objects.link(obj)
    export_objects.append(obj)

export_objects.extend(moving)
export_objects.extend(walkers)
export_objects.extend(walker_limb_pivots)
export_objects.append(scene.camera)
for obj in export_objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = parts[0]

projection = scene.camera.calc_matrix_camera(depsgraph, x=1280, y=720, scale_x=1, scale_y=1)
def screen_point(world):
    point = world_to_camera_view(scene, scene.camera, world)
    return [round(point.x * 1280, 2), round((1 - point.y) * 720, 2)]

role_workers = {
    "artist": ".014", "designer": ".005", "mentor": ".016",
    "director": ".007", "entry": ".006",
}
bubble_anchors = {
    role: screen_point(bpy.data.objects["Worker head" + suffix].matrix_world.translation)
    for role, suffix in role_workers.items()
}
character_screen = [screen_point(point) for point in world_points]
canqi_box = [
    round(min(point[0] for point in character_screen), 2),
    round(min(point[1] for point in character_screen), 2),
    round(max(point[0] for point in character_screen), 2),
    round(max(point[1] for point in character_screen), 2),
]
meta = {
    "source": SOURCE.name,
    "camera": scene.camera.name,
    "projectionRows": [list(row) for row in projection],
    "referenceWidth": 1280,
    "referenceHeight": 720,
    "staticObjectsMerged": static_count,
    "materialGroups": len(groups),
    "dynamicObjects": len(moving),
    "walkingWorkers": [walker.name for walker in walkers],
    "frontLampAnchors": [
        {"row": row, "column": col, "position": [round(x + .30, 3), .918,
         round(-(3.80 + row * 4.30 + .92 + .047), 3)]}
        for row in range(4) for col, x in enumerate([-9.5, -4.6, -.2, 4.2])
    ],
    "characterParts": [part.name for part in parts],
    "cameraPullbackMetres": .25,
    "cameraRaiseMetres": .38,
    "cameraExtraDownTiltDegrees": 3,
    "bubbleAnchors": bubble_anchors,
    "canqiBox": canqi_box,
}
(OUT / "scene-meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
target = OUT / "canqi-night-office.glb"
bpy.ops.export_scene.gltf(
    filepath=str(target),
    export_format="GLB",
    use_selection=True,
    export_cameras=True,
    export_lights=False,
    export_yup=True,
)
print("REALTIME_EXPORT=" + json.dumps({**meta, "glb": str(target), "bytes": target.stat().st_size}))
