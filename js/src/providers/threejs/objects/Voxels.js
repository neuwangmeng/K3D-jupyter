'use strict';

var voxelMeshGenerator = require('./../../../core/lib/helpers/voxelMeshGenerator'),
    buffer = require('./../../../core/lib/helpers/buffer'),
    interactionsVoxels = require('./../interactions/Voxels');

/**
 * Loader strategy to handle Voxels object
 * @method Voxel
 * @memberof K3D.Providers.ThreeJS.Objects
 * @param {Object} config all configurations params from JSON
 * @param {Object} K3D
 */
module.exports = function (config, K3D) {
    const chunkSize = 32;

    var modelMatrix = new THREE.Matrix4().fromArray(config.model_matrix.buffer),
        width = config.voxels.shape[2],
        height = config.voxels.shape[1],
        length = config.voxels.shape[0],
        voxels = config.voxels.buffer,
        colorMap = config.color_map.buffer || [16711680, 65280, 255, 16776960, 16711935, 65535],
        object = new THREE.Group(),
        generate,
        mesh,
        x,
        y,
        z,
        chunksCount = {
            x: Math.ceil(width / chunkSize),
            y: Math.ceil(height / chunkSize),
            z: Math.ceil(length / chunkSize)
        },
        offsets,
        rollOverMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.2 / width, 1.2 / height, 1.2 / length)
                .translate(0.5 / width, 0.5 / height, 0.5 / length),
            new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true})
        ),
        colorsToFloat32Array = buffer.colorsToFloat32Array,
        listenersId;

    colorMap = colorsToFloat32Array(colorMap);

    object.voxelSize = {width: width, height: height, length: length};
    object.voxels = voxels;

    for (z = 0; z < chunksCount.z; z++) {
        for (y = 0; y < chunksCount.y; y++) {
            for (x = 0; x < chunksCount.x; x++) {

                offsets = {x: x * chunkSize, y: y * chunkSize, z: z * chunkSize};

                generate = voxelMeshGenerator.initializeGreedyVoxelMesh(
                    voxels,
                    colorMap,
                    chunkSize,
                    object.voxelSize,
                    offsets
                );

                mesh = new THREE.Mesh(
                    getGeometry(generate()),
                    new THREE.MeshPhongMaterial({
                        vertexColors: THREE.VertexColors,
                        shading: THREE.FlatShading,
                        side: THREE.DoubleSide
                    })
                );

                mesh.voxel = {
                    generate: generate,
                    offsets: offsets,
                    getGeometry: getGeometry,
                    chunkSize: chunkSize
                };

                mesh.interactions = interactionsVoxels(object, mesh, rollOverMesh, K3D);

                object.add(mesh);
            }
        }
    }

    object.position.set(-0.5, -0.5, -0.5);
    object.updateMatrix();

    modelMatrix.set.apply(modelMatrix, config.model_matrix.buffer);
    object.applyMatrix(modelMatrix);

    rollOverMesh.visible = false;
    rollOverMesh.geometry.computeBoundingSphere();
    rollOverMesh.geometry.computeBoundingBox();

    object.add(rollOverMesh);
    object.updateMatrixWorld();

    listenersId = K3D.on(K3D.events.VIEW_MODE_CHANGE, function () {
        rollOverMesh.visible = false;
    });

    object.onRemove = function () {
        K3D.off(K3D.events.VIEW_MODE_CHANGE, listenersId);
    };

    return Promise.resolve(object);
};

function getGeometry(chunkStructure) {
    var geometry = new THREE.BufferGeometry();

    geometry.addAttribute('position',
        new THREE.BufferAttribute(new Float32Array(chunkStructure.vertices), 3)
    );
    geometry.addAttribute('color',
        new THREE.BufferAttribute(new Float32Array(chunkStructure.colors), 3)
    );

    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    return geometry;
}
