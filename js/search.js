window.onload = function () {
    var items = {
        1: {
            type: 'lost',
            typeName: '失物信息',
            title: '黑色钱包',
            img: '../images/lost-wallet.png',
            desc: '6月5日中午在图书馆三楼阅览室靠窗座位自习时不慎遗失黑色皮质折叠钱包，右侧边角有轻微磨损，内有身份证、两张银行卡及少量现金。如有拾到者请联系失主，核实身份后当面领取，必有酬谢。',
            phoneLabel: '失主电话',
            phone: '138****6721',
            time: '2026-06-05 12:40',
            place: '图书馆三楼阅览室'
        },
        2: {
            type: 'lost',
            typeName: '失物信息',
            title: '蓝色雨伞',
            img: '../images/lost-umbrella.png',
            desc: '6月3日上午下课后，于教学楼 A 栋一楼大厅至南门途中遗失藏青色长柄伞一把，伞面印有白色云朵图案，伞柄贴有「经管2023」字样贴纸。烦请拾到者与失主联系归还。',
            phoneLabel: '失主电话',
            phone: '159****3846',
            time: '2026-06-03 09:15',
            place: '教学楼 A 栋大厅'
        },
        3: {
            type: 'lost',
            typeName: '失物信息',
            title: '校园卡',
            img: '../images/lost-campus-card.png',
            desc: '5月28日晚在第二食堂二楼窗口用餐后遗失校园一卡通，卡号以 2022 开头，背面贴有联系方式便利贴。卡片已挂失，拾到者请交至失物招领处或电话联系失主，凭学生证核实后领取，必有感谢。',
            phoneLabel: '失主电话',
            phone: '186****2093',
            time: '2026-05-28 18:42',
            place: '第二食堂二楼'
        },
        4: {
            type: 'found',
            typeName: '待认领',
            title: '红色保温杯',
            img: '../images/found-thermos.jpg',
            desc: '体育馆更衣室拾取，杯身印有校徽图案，杯盖内侧刻有姓名缩写「L·Z」，请失主说明杯内物品特征后联系领取。',
            phoneLabel: '联系人电话',
            phone: '139****7765',
            time: '2026-06-07 11:20',
            place: '体育馆更衣室'
        },
        5: {
            type: 'found',
            typeName: '待认领',
            title: '无线蓝牙耳机',
            img: '../images/found-earbuds.jpg',
            desc: '操场看台座椅下方拾取，白色充电盒略有磨损，内含左右两只耳机，请失主描述配对设备名称后认领。',
            phoneLabel: '联系人电话',
            phone: '152****3184',
            time: '2026-06-06 16:45',
            place: '操场看台'
        }
    };

    var timer;
    var pics = [];
    var dots = [];
    var banner = document.getElementById('banner');
    var slideDetail = document.getElementById('slideDetail');
    var bannerWidth = banner.offsetWidth || Math.min(window.innerWidth * 0.92, 1150);
    var imgWidth = Math.round(bannerWidth * 0.55);
    var imgHeight = Math.round(imgWidth * 421 / 750);
    var leftSmall = 0;
    var leftCenter = Math.round(bannerWidth * 0.2);
    var leftRight = Math.round(bannerWidth * 0.38);

    banner.style.height = imgHeight + 50 + 'px';

    for (var i = 1; i <= 5; i++) {
        var itemId = i > 3 ? i - 3 : i + 2;
        var lbli = document.createElement('li');
        var lbimg = document.createElement('img');

        lbimg.src = items[itemId].img;
        lbimg.alt = items[itemId].title;
        lbimg.style.width = imgWidth + 'px';
        lbimg.style.height = imgHeight + 'px';
        lbli.appendChild(lbimg);
        banner.appendChild(lbli);
        pics.push(lbli);
        pics[pics.length - 1].style.left = '0px';

        lbimg.onmouseenter = function () {
            clearInterval(timer);
        };
        lbimg.onmouseleave = function () {
            timer = setInterval(getpre, 3000);
        };

        var bottomdot = document.createElement('div');
        bottomdot.style.left = (bannerWidth / 6) * i + 'px';
        bottomdot.name = itemId;
        dots.push(bottomdot);
        banner.appendChild(bottomdot);

        lbli.id = itemId;
    }

    var len = pics.length - 1;

    function renderDetail(itemId) {
        var item = items[itemId];
        if (!item) return;

        slideDetail.style.opacity = '0';
        setTimeout(function () {
            var timeLabel = item.type === 'lost' ? '丢失时间' : '发布时间';
            var placeLabel = item.type === 'lost' ? '丢失地点' : '拾取地点';

            slideDetail.innerHTML =
                '<h2>' + item.title +
                ' <span class="type-badge ' + item.type + '">' + item.typeName + '</span></h2>' +
                '<p>&emsp;&emsp;' + item.desc + '</p>' +
                '<div class="item-meta">' +
                '<span class="meta-item"><span class="meta-label">' + item.phoneLabel + '</span>' + item.phone + '</span>' +
                '<span class="meta-item"><span class="meta-label">' + timeLabel + '</span>' + item.time + '</span>' +
                '<span class="meta-item"><span class="meta-label">' + placeLabel + '</span>' + item.place + '</span>' +
                '</div>';
            slideDetail.style.opacity = '1';
        }, 150);
    }

    function applyLayout() {
        for (var i = 0; i < pics.length; i++) {
            pics[i].style.zIndex = i;
            pics[i].style.transform = 'scale(1)';
        }
        pics[len - 2].style.left = leftSmall + 'px';
        pics[len - 2].style.opacity = 0.5;
        pics[len - 3].style.opacity = 0;
        pics[len - 4].style.opacity = 0;
        pics[len - 1].style.zIndex = 100;
        pics[len - 1].style.left = leftCenter + 'px';
        pics[len - 1].style.transform = 'scale(1.1)';
        pics[len - 1].style.opacity = 1;
        pics[len].style.left = leftRight + 'px';
        pics[len].style.opacity = 0.5;
        renderDetail(pics[len - 1].id);
    }

    applyLayout();

    function getnext() {
        var give_up = pics[len];
        pics.pop();
        pics.unshift(give_up);
        applyLayout();
        dotmov();
        bindClick();
    }

    function getpre() {
        var give_up = pics[0];
        pics.push(give_up);
        pics.shift();
        applyLayout();
        dotmov();
        bindClick();
    }

    function bindClick() {
        pics[len - 2].onclick = function () {
            getnext();
        };
        pics[len].onclick = function () {
            getpre();
        };
    }

    bindClick();

    dots[0].style.background = 'rgb(48, 72, 77)';

    function dotmov() {
        for (var i = 0; i < dots.length; i++) {
            if (dots[i].name == pics[len - 1].id) {
                dots[i].style.background = 'rgb(48, 72, 77)';
            } else {
                dots[i].style.background = 'rgb(123, 168, 175)';
            }
        }
    }

    for (var d = 0; d < dots.length; d++) {
        (function (dot) {
            dot.onclick = function () {
                var targetId = parseInt(dot.name, 10);
                while (pics[len - 1].id != targetId) {
                    getpre();
                }
            };
        })(dots[d]);
    }

    timer = setInterval(getpre, 3000);

    document.getElementById('searchBtn').onclick = function () {
        var keyword = document.getElementById('searchInput').value.trim();
        if (!keyword) return;

        var matchedId = null;
        for (var key in items) {
            if (items[key].title.indexOf(keyword) !== -1 ||
                items[key].desc.indexOf(keyword) !== -1 ||
                items[key].place.indexOf(keyword) !== -1) {
                matchedId = parseInt(key, 10);
                break;
            }
        }

        if (matchedId) {
            while (pics[len - 1].id != matchedId) {
                getpre();
            }
        } else {
            alert('未找到相关物品，请尝试其他关键词。');
        }
    };

    var filterBtns = document.querySelectorAll('.filter-btn');
    for (var f = 0; f < filterBtns.length; f++) {
        filterBtns[f].onclick = function () {
            for (var j = 0; j < filterBtns.length; j++) {
                filterBtns[j].classList.remove('active');
            }
            this.classList.add('active');
        };
    }
};
