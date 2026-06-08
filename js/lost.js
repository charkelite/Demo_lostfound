(function () {
    var STORAGE_KEY = 'userLostItems';
    var lostList = document.getElementById('lostList');
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

    function statusBadgeClass(status) {
        return status === '已找回' ? 'status-badge found-back' : 'status-badge';
    }

    function createItemElement(item) {
        var card = document.createElement('div');
        card.className = 'con con-user';
        card.dataset.id = item.id;
        card.innerHTML =
            '<button type="button" class="item-del" aria-label="删除">&times;</button>' +
            '<div class="imghid"><div class="img" style="background-image:url(' + item.image + ')"></div></div>' +
            '<div class="txt">' +
            '<h2>' + escapeHtml(item.name) +
            ' <span class="' + statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + '</span></h2>' +
            '<p>&emsp;&emsp;' + escapeHtml(item.desc) + '</p>' +
            '<div class="item-meta">' +
            '<span class="meta-item"><span class="meta-label">失主电话</span>' + escapeHtml(item.phone || '') + '</span>' +
            '<span class="meta-item"><span class="meta-label">丢失时间</span>' + escapeHtml(item.time) + '</span>' +
            '<span class="meta-item"><span class="meta-label">丢失地点</span>' + escapeHtml(item.place || '') + '</span>' +
            '</div></div>';

        card.querySelector('.item-del').onclick = function () {
            deleteItem(item.id);
        };

        return card;
    }

    function renderUserItems() {
        var items = getItems();
        Array.prototype.forEach.call(lostList.querySelectorAll('.con-user'), function (el) {
            el.remove();
        });

        for (var i = items.length - 1; i >= 0; i--) {
            lostList.insertBefore(createItemElement(items[i]), lostList.firstChild);
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
            id: 'lost-' + Date.now(),
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

    renderUserItems();
})();
