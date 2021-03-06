'use strict';

var viewModes = {
    view: 'view',
    add: 'add',
    change: 'change'
};

function viewModeButton(container, K3D) {
    /* jshint -W101 */
    var images = {
            view: 'data:image/png;base64,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',
            add: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsSAAALEgHS3X78AAABtUlEQVRIib3WvWoUURjG8d/OjI1CAhZB0gSEEAvTBCshehFehLcgghYJES8ghXbegBcQSSOBVCZNxEZIKWELwUC6zcZi3t28OZmNFrt54DAfz3v+5z1zvqbnunqoMMQF5vAcT/AgYk7wDV9x2lHnCqwLfo5lvMU6fuMn+hG3EP597GEj/LqrkRIOWzjDB6x0BYdWIuYs6ghGmbhelBq7+IGlwmuK0kugpaizG4zsjVuFL9hJ75vkdamKmJF2gpGZ6rhu4SCZtf9XnYAHLj/XmPFIOzOWS6PQnSiTGhGMk2CO9QnbcZ+7rHj3Jsq/4raDqcE8nuJFmMMJGdJOz5s0qvsRnzHfaOf5KY60I58baNJ1MCFbyRsG4yiY6w3WcBwBdQEqoReFV/qZcYy1BosuV2gZ+Dr8gXYxPQvvPe5FL37hnXb1Z/WxeNMcn4pGGTzu8M6xmeIGuBvPr3SPS9YCvlc4xMMELRMYFa5uAaWXExPMw0q7G85hVTuI+bMNTB7MLq8Kxmow9yr8wT5epqBJ6uueELkBwdoPNma8VdzKZjfT7ZpbOHBGoKkfmTM/9K91w5R/W/4CjN57n+2kGYgAAAAASUVORK5CYII=',
            change: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsSAAALEgHS3X78AAADdElEQVRIiZ2VO2wcVRSG///eufbMzuzTsS0kWpoUAYRElyCBAIkGCSSogI6GOEECJCTCw6ZJUoVHKqQAIkICGhoQEtBhCgqEeJV0FGS93ll7Hrszd+6h2LWxHXtZ+0hTXen7/nPu0VwuLp5SSpE4eVEEJGlFxJCodg5EIJ5SJKlOKiAgTillrLV3eZ7+UwQGgAAAKVAT10k+igiV0lWe51e73Y0/8nz4FIlSRAwgEMGO4PjJRUCtdZFl2btxPDhPshwMtj4rS3tOa5WLwJAnExyEryilchExjUb9hjHerTwfPq6UygHwuIJD4c65oNFofFyvRyv9fnyz34+/zPP8aQD2OIIj4c1m46NGI3qh2+2tD4ej+0giSZJrIrI8q2AqvF6Pzne7vR9Go9E9JAuSaLVar5D8ZxYBRYAjxvLhBL6+Bz7X6bSfM8bcFBHjzSBwWqsqy7JrB5LfqNejCxP43XvgzxpjPhFxPslyWgcUQQCgyvPhS3E8uHgAfrHb7f24H97ahQOwwNFrqkhaEnZjY/O3oiiaxni/OOeCVqv5Xr0evThJfmZ/8rl9cAA4bESa5Gg4HD1WVdWdzWbj+X4//joMa2siQx/g773e5le3w81t8MM6oAgcSQJgkqSXrbWn2+3WI2marfq+/0GSbL+c58Oz08ZylGBnFcssy64PBlufh2H4WpKkb1tr7223Ww9lWbYaBMF1z/N+BTDX6bSfOWws+xIvLy9qkkoEorW2O6sIAEqpzSgKX0/T7FIUhW95nvdzvx9/GwT++0EQrBvjfSMi88B/v+gDJbsdKMUqy7J34niwMr5gOhHpJEm6Foa1tSRJ37S2OtNqNZ8sS3v/BD43BT7mikCTLMuyPBfHgwskCwB6Mj4n4hbSNF0Lw9rq9vb2lapydywsdB4VkRoANw0OADqKQgAwSqm/AOiiKB4kWQHgWMLKOYmcc6fb7eYTWuu/lVK3/g+8V6BIagB6ft7/DpC5oigeICk7cySpoii67Pv+F1qrHiAeJq/WLAIqpewktfJ9/3sAo6IoHwZQiYjXaNRfDcPa1cmFclY4AHhV5U7F8danzrkFEnYM4BDASETmoyh8IwxrV0TkyFWcVlxaWgystWedk4CEmyQkiZRUqTHmJwAKEBkfzV4iIlxaWlRaa3dY1yLA+AHffelnT05ARPAvfdYkQLy5zJUAAAAASUVORK5CYII='
        },
        activeViewMode,
        element = document.createElement('img');
    /* jshint +W101 */

    element.style.cssText = [
        'background: white',
        'cursor: pointer',
        'width: 24px',
        'height: 24px',
        'margin: 0 3px',
        'padding: 2px'
    ].join(';');

    function setMode(mode) {
        activeViewMode = mode;
        element.src = images[mode];
        K3D.setViewMode(mode);

        element.setAttribute('title', 'Voxels mode: ' + mode);
    }

    element.addEventListener('click', function () {
        var modes = [];

        Object.keys(viewModes).forEach(function (key) {
            modes.push(viewModes[key]);
        });

        activeViewMode = modes[(modes.indexOf(activeViewMode) + 1) % modes.length];

        setMode(activeViewMode);
    });

    [K3D.events.OBJECT_LOADED, K3D.events.OBJECT_REMOVED].forEach(function (event) {
        K3D.on(event, function () {
            var ObjectsListJson = K3D.getWorld().ObjectsListJson,
                voxelPresent = false;

            Object.keys(ObjectsListJson).forEach(function (id) {
                if (ObjectsListJson[id].type === 'Voxels') {
                    voxelPresent = true;
                }
            });

            element.style.display = voxelPresent ? 'initial' : 'none';
        });
    });

    setMode(K3D.parameters.viewMode);

    container.insertBefore(element, container.firstChild);
}

module.exports = {
    viewModeButton: viewModeButton,
    viewModes: viewModes
};
