window.onscroll = function() {
  var topScroll = get_scrollTop_of_body()// 滚动的距离,距离顶部的距离
  var bignav = document.getElementById('navigation')// 获取到导航栏id
  if (topScroll > 250) { // 当滚动距离大于250px时执行下面的东西
    bignav.style.position = 'fixed'
    bignav.style.top = '0'
    bignav.style.zIndex = '9999'
  } else { // 当滚动距离小于250的时候执行下面的内容，也就是让导航栏恢复原状
    bignav.style.position = 'absolute'
    bignav.style.top = '260px'
  }
}
/* 解决浏览器兼容问题*/
function get_scrollTop_of_body() {
  var scrollTop
  if (typeof window.pageYOffset !== 'undefined') { // pageYOffset指的是滚动条顶部到网页顶部的距离
    scrollTop = window.pageYOffset
  } else if (typeof document.compatMode !== 'undefined' && document.compatMode !== 'BackCompat') {
    scrollTop = document.documentElement.scrollTop
  } else if (typeof document.body !== 'undefined') {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

