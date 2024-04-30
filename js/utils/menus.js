function toggleSide(id) {
   const sidenav = document.getElementById(id);
   const mainContent = document.getElementById('main');
   const isMobile = window.matchMedia("(max-width: 768px)").matches;
   const openWidth = isMobile ? "100%" : "29%";

   const isLeftMenu = id.includes("left");

   const shiftClass = isLeftMenu ? 'content-shift-left' : 'content-shift-right';
   const oppositeShiftClass = isLeftMenu ? 'content-shift-right' : 'content-shift-left';

   if (sidenav.style.width === openWidth) {
      sidenav.style.width = '0';
      mainContent.classList.remove(shiftClass);
      if (document.getElementById(isLeftMenu ? 'rightMenu' : 'leftMenu').style.width === openWidth) {
         mainContent.classList.add(oppositeShiftClass);
         mainContent.classList.remove('content-shift-both');
      }
   } else {
      sidenav.style.width = openWidth;
      if (document.getElementById(isLeftMenu ? 'rightMenu' : 'leftMenu').style.width === openWidth) {
         mainContent.classList.add('content-shift-both');
      } else {
         mainContent.classList.add(shiftClass);
      }
   }
}