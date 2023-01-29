import $ from 'jquery';

const elementMap = {};
const listenerMap = {};

function throttle(func, wait = 300) {
  let timer = null;
  return function () {
    let args = arguments;
    let context = this;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => func.apply(context, args));
    } else {
      if (timer) return;
      timer = setTimeout(function () {
        clearTimeout(timer);
        timer = null;
        func.apply(context, args);
      }, wait);
    }
  };
}

function toggleScrollBtns(uid) {
  const {
    $tableBody,
    $leftBtn,
    $rightBtn
  } = elementMap[uid];
  let noScroll = $tableBody.hasClass('is-scrolling-none');
  if (noScroll) {
    $leftBtn.hide();
    $rightBtn.hide();
    return;
  }
  // isLeft isRight 判断方案缺陷：
  // 1. 使用 hasClass 判断， el-table 的 class 在 resize 时候有 bug
  // 2. 使用 width 判断，浏览器不同的显示缩放比例下，像素计算不够准确，需要调整边界值

  // let isLeft = $tableBody.hasClass('is-scrolling-left')
  let isLeft = $tableBody.scrollLeft() <= 10;
  if (isLeft) {
    $leftBtn.hide();
    $rightBtn.show();
    return;
  }

  // let isRight = $tableBody.hasClass('is-scrolling-right')
  let isRight =
    $tableBody.scrollLeft() + $tableBody.width() >=
    $tableBody[0].scrollWidth - 10; // -10 兼容用户缩放
  if (isRight) {
    $leftBtn.show();
    $rightBtn.hide();
    return;
  }

  let isMiddle = $tableBody.hasClass('is-scrolling-middle');
  if (isMiddle) {
    $leftBtn.show();
    $rightBtn.show();
  }
}

function scroll(direction, uid) {
  const {
    $tableBody
  } = elementMap[uid];
  let step = direction === 'left' ? -100 : 100;
  $tableBody.scrollLeft($tableBody.scrollLeft() + step);
}

function calcBtnPos(uid) {
  const {
    $tableHeader,
    $leftBtn,
    $rightBtn,
    $fixedHeader,
    $fixedLeftHeader
  } = elementMap[uid];
  const fixedHeaderCellWidth =
    ($fixedHeader && $fixedHeader.width()) || 0;
  const fixedLeftHeaderCellWidth =
    ($fixedLeftHeader && $fixedLeftHeader.width()) || 0;
  let height = $tableHeader.height();
  let left = fixedLeftHeaderCellWidth;
  let right = fixedHeaderCellWidth;
  if (['fixed', 'sticky'].includes($tableHeader.css('position'))) {
    left = $tableHeader.scrollLeft() + left;
    right = right - $tableHeader.scrollLeft();
  }

  let commonStyle = {
    position: 'absolute',
    top: 0 + 'px',
    background: '#dbe1e4',
    color: '#074a88',
    height,
    'line-height': height + 'px',
    padding: '0 8px',
    cursor: 'pointer',
    'z-index': 100
  };
  $leftBtn.addClass('el-icon-arrow-left').css({
    ...commonStyle,
    left: left + 'px'
  });
  $rightBtn.addClass('el-icon-arrow-right').css({
    ...commonStyle,
    right: right + 'px'
  });
}

/**
 * el-table 表头滚动指令
 * 在 el-table 表头两端各增加一个操作按钮，点击按钮可以向左或向右滚动表格
 *
 * 由于table组件原因，在指令 bind 时，固定列还未渲染。
 * 直接在data 中写静态数据，会使滚动按钮位置偏移。异步数据无影响。
 */
const ElTableHeaderScroll = {
  /**
   * 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
   */
  bind() { },
  /**
   * 被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。
   */
  inserted(el, binding, vnode) {
    if (binding.value && !binding.value.on) return;
    const uid = vnode.componentInstance._uid;
    let $el = $(el);
    let $parent = $(binding.value?.parent);
    let $tableHeader = $el.find('.el-table__header-wrapper');
    if ($tableHeader.find('.el-table-header-scroll-icon').length) return;

    let $tableBody = $el.find('.el-table__body-wrapper');

    let $leftBtn = $('<span></span>').addClass('el-table-header-scroll-icon left');
    let $rightBtn = $('<span></span>').addClass('el-table-header-scroll-icon right');

    $tableHeader.prepend($leftBtn, $rightBtn);

    // event
    const handleScrollLeft = scroll.bind(null, 'left', uid);
    const handleScrollRight = scroll.bind(null, 'right', uid);

    const toggleScrollBtnsHandler = throttle(() => {
      calcBtnPos(uid);
      toggleScrollBtns(uid);
    }, 66);

    $leftBtn.on('click', handleScrollLeft);
    $rightBtn.on('click', handleScrollRight);
    $tableBody.on('scroll', toggleScrollBtnsHandler);
    $parent.on('scroll', toggleScrollBtnsHandler);
    document.body.addEventListener('scroll', toggleScrollBtnsHandler);
    window.addEventListener('resize', toggleScrollBtnsHandler);
    window.addEventListener('scroll', toggleScrollBtnsHandler);
    window.addEventListener('whell', toggleScrollBtnsHandler);
    el.__resizeListeners__ &&
      el.__resizeListeners__.push(toggleScrollBtnsHandler);

    elementMap[uid] = {
      $el,
      $parent,
      $tableHeader,
      $tableBody,
      $leftBtn,
      $rightBtn
    };
    listenerMap[uid] = {
      handleScrollLeft,
      handleScrollRight,
      toggleScrollBtnsHandler
    };
  },
  /**
   * 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
   * 指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值，来忽略不必要的模块更新
   */
  update(el, binding, vnode) {
    if (binding.value && !binding.value.on) return;
    const uid = vnode.componentInstance._uid;
    const {
      $el
    } = elementMap[uid];
    const $fixedLeftHeader = $el.find('.el-table__fixed');
    const $fixedHeader = $el.find('.el-table__fixed-right');
    elementMap[uid].$fixedLeftHeader = $fixedLeftHeader;
    elementMap[uid].$fixedHeader = $fixedHeader;

    toggleScrollBtns(uid);
    calcBtnPos(uid);
  },
  /**
   * 指令所在组件的 VNode 及其子 VNode 全部更新后调用
   */
  componentUpdated() { },
  /**
   * 只调用一次，指令与元素解绑时调用
   */
  unbind(el, binding, vnode) {
    if (binding.value && !binding.value.on) return;
    const uid = vnode.componentInstance._uid;
    const {
      $tableBody,
      $leftBtn,
      $rightBtn,
      $parent
    } = elementMap[uid];
    const {
      handleScrollLeft,
      handleScrollRight,
      toggleScrollBtnsHandler
    } = listenerMap[uid];
    $leftBtn.off('click', handleScrollLeft);
    $rightBtn.off('click', handleScrollRight);
    $tableBody.off('scroll', toggleScrollBtnsHandler);
    $parent.off('scroll', toggleScrollBtnsHandler);
    document.body.removeEventListener('scroll', toggleScrollBtnsHandler);
    window.removeEventListener('resize', toggleScrollBtnsHandler);
    window.removeEventListener('scroll', toggleScrollBtnsHandler);
    window.removeEventListener('whell', toggleScrollBtnsHandler);
    el.__resizeListeners__ &&
      el.__resizeListeners__.splice(
        el.__resizeListeners__.indexOf(toggleScrollBtnsHandler),
        1
      );
    // 手动垃圾回收
    elementMap[uid] = null;
    delete elementMap[uid];
    listenerMap[uid] = null;
    delete listenerMap[uid];
  }
};

export default ElTableHeaderScroll;

