(function () {
    var STORAGE_KEY = 'userFoundItems';
    var STATIC_STATUS_KEY = 'foundStaticStatus';
    var foundList = document.getElementById('foundList');
    var uploadModal = document.getElementById('uploadModal');
    var uploadForm = document.getElementById('uploadForm');
    var itemImage = document.getElementById('itemImage');
    var imagePreview = document.getElementById('imagePreview');
    var previewDataUrl = '';

    function pad(n) {
        var s = String(n);
        return s.length < 2 ? '0' + s : s;
    }

    function formatTime(date) {
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
            ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getItems() {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveItems(items) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function getStaticStatus() {
        try {
            return JSON.parse(sessionStorage.getItem(STATIC_STATUS_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveStaticStatus(map) {
        sessionStorage.setItem(STATIC_STATUS_KEY, JSON.stringify(map));
    }

    function statusBadgeClass(status, doneStatus, doneClass) {
        return status === doneStatus ? 'status-badge status-toggle ' + doneClass : 'status-badge status-toggle';
    }

    function applyStatusBadge(badge, status) {
        var pending = badge.dataset.pending;
        var done = badge.dataset.done;
        var doneClass = badge.dataset.doneClass || '';
        badge.textContent = status;
        badge.className = statusBadgeClass(status, done, doneClass);
        badge.title = status === done ? '点击改为' + pending : '点击改为' + done;
    }

    function updateUserItemStatus(id, status) {
        var items = getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items[i].status = status;
                break;
            }
        }
        saveItems(items);
    }

    function bindStatusToggle(badge, itemId, isUser) {
        badge.onclick = function () {
            var pending = badge.dataset.pending;
            var done = badge.dataset.done;
            var current = badge.textContent.trim();
            var next = current === done ? pending : done;
            applyStatusBadge(badge, next);

            if (isUser) {
                updateUserItemStatus(itemId, next);
            } else {
                var map = getStaticStatus();
                map[itemId] = next;
                saveStaticStatus(map);
            }
        };
    }

    function initStaticStatusBadges() {
        var map = getStaticStatus();
        Array.prototype.forEach.call(foundList.querySelectorAll('.found-item:not(.found-item-user)'), function (card) {
            var itemId = card.dataset.itemId;
            var badge = card.querySelector('.status-toggle');
            if (!itemId || !badge) {
                return;
            }
            if (map[itemId]) {
                applyStatusBadge(badge, map[itemId]);
            } else {
                applyStatusBadge(badge, badge.dataset.pending);
            }
            bindStatusToggle(badge, itemId, false);
        });
    }

    function createItemElement(item) {
        var card = document.createElement('div');
        card.className = 'found-item found-item-user';
        card.dataset.id = item.id;
        card.innerHTML =
            '<button type="button" class="item-del" aria-label="删除">&times;</button>' +
            '<div class="imghid"><div class="img" style="background-image:url(' + item.image + ')"></div></div>' +
            '<div class="txt">' +
            '<h2>' + escapeHtml(item.name) +
            ' <button type="button" class="' + statusBadgeClass(item.status, '已认领', 'claimed') +
            '" data-pending="待认领" data-done="已认领" data-done-class="claimed">' +
            escapeHtml(item.status) + '</button></h2>' +
            '<p>&emsp;&emsp;' + escapeHtml(item.desc) + '</p>' +
            '<div class="item-meta">' +
            '<span class="meta-item"><span class="meta-label">联系人电话</span>' + escapeHtml(item.phone || '') + '</span>' +
            '<span class="meta-item"><span class="meta-label">发布时间</span>' + escapeHtml(item.time) + '</span>' +
            '<span class="meta-item"><span class="meta-label">拾取地点</span>' + escapeHtml(item.place || '') + '</span>' +
            '</div></div>';

        card.querySelector('.item-del').onclick = function () {
            deleteItem(item.id);
        };

        var badge = card.querySelector('.status-toggle');
        applyStatusBadge(badge, item.status);
        bindStatusToggle(badge, item.id, true);

        return card;
    }

    function renderUserItems() {
        var items = getItems();
        Array.prototype.forEach.call(foundList.querySelectorAll('.found-item-user'), function (el) {
            el.remove();
        });

        for (var i = items.length - 1; i >= 0; i--) {
            foundList.insertBefore(createItemElement(items[i]), foundList.firstChild);
        }
    }

    function deleteItem(id) {
        var items = getItems().filter(function (item) {
            return item.id !== id;
        });
        saveItems(items);
        renderUserItems();
    }

    function openModal() {
        uploadModal.classList.add('show');
    }

    function closeModal() {
        uploadModal.classList.remove('show');
        uploadForm.reset();
        previewDataUrl = '';
        imagePreview.style.backgroundImage = '';
        imagePreview.textContent = '点击选择图片';
    }

    document.getElementById('openUploadBtn').onclick = openModal;
    document.getElementById('uploadCancel').onclick = closeModal;

    uploadModal.onclick = function (event) {
        if (event.target === uploadModal) {
            closeModal();
        }
    };

    itemImage.onchange = function () {
        var file = itemImage.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            previewDataUrl = e.target.result;
            imagePreview.style.backgroundImage = 'url(' + previewDataUrl + ')';
            imagePreview.textContent = '';
        };
        reader.readAsDataURL(file);
    };

    uploadForm.onsubmit = function (event) {
        event.preventDefault();

        if (!previewDataUrl) {
            alert('请上传物品图片');
            return;
        }

        var item = {
            id: 'found-' + Date.now(),
            name: document.getElementById('itemName').value.trim(),
            status: document.getElementById('itemStatus').value,
            desc: document.getElementById('itemDesc').value.trim(),
            place: document.getElementById('itemPlace').value.trim(),
            phone: document.getElementById('itemPhone').value.trim(),
            image: previewDataUrl,
            time: formatTime(new Date())
        };

        var items = getItems();
        items.push(item);
        saveItems(items);
        renderUserItems();
        closeModal();
    };

    initStaticStatusBadges();
    renderUserItems();
})();
