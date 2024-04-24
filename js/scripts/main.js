// main.js

function toggleSide(id) {
   const sidenav = document.getElementById(id);
   const main = document.getElementById("main");
   const isMobile = window.matchMedia("(max-width: 768px)").matches;
   const openWidth = isMobile ? "100%" : "550px";

   const isLeft = id.includes("left");
   const oppositeId = isLeft ? 'rightMenu' : 'leftMenu';
   const oppositeSideNav = document.getElementById(oppositeId);
   const contentShiftClass = isLeft ? 'content-shift-left' : 'content-shift-right';

   if (oppositeSideNav.style.width === openWidth) {
      oppositeSideNav.style.width = '0';
      main.classList.remove(isLeft ? 'content-shift-right' : 'content-shift-left');
   }

   if (sidenav.style.width === openWidth) {
      sidenav.style.width = '0';
      main.classList.remove(contentShiftClass);
   } else {
      sidenav.style.width = openWidth;
      main.classList.add(contentShiftClass);
   }
}
