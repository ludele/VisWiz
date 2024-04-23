let leftMenu = document.getElementById(leftMenu);
let rightMenu = document.getElementById(rightMenu);

function toggleSideMenu(id) {
   const sidenav = document.getElementById(id);
   const isMobile = window.matchMedia("(max-width: 768px)").matches;
   const openWidth = isMobile ? "100%" : "350px";

   sidenav.style.width = sidenav.style.width === openWidth ? "0" : openWidth;
}