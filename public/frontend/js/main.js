/* -----------------------  Menu SearchBar DropDown   ----------------------- */
const backdrop = document.querySelector('.backdrop');
const menuToggler = document.querySelector('#mobile-nav .mobile-nav__btn');
const menu = document.querySelector('#mobile-nav .mobile-nav__menu');
const searchBtnMain = document.querySelector('#searchBtn-main');
const searchBtnMob = document.querySelector('#searchBtn-mob');
const searchBar = document.querySelector('#searchBar');
const closeBtn = document.querySelector(
  '#mobile-nav .mobile-nav__items #closeBtn'
);
const dropDownUserMobile = document.querySelector(
  '#mobile-nav .mobile-nav__right .dropdown-user .dropbtn'
);
const dropDownUserMobileContent = document.querySelector(
  '#mobile-nav .mobile-nav__right .dropdown-user .dropdown-content'
);

console.log(dropDownUserMobile);
console.log(dropDownUserMobileContent);
/*  ----------  DropDown Menu On Mobile  ----------  */
dropDownUserMobile.addEventListener('click', () => {
  dropDownUserMobileContent.classList.toggle('hide');
});

/*  ----------  Mobile Navbar Open and Close  ----------  */
closeBtn.addEventListener('click', () => {
  backdrop.classList.remove('show');
  menu.classList.remove('show');
});
backdrop.addEventListener('click', () => {
  backdrop.classList.remove('show');
  menu.classList.remove('show');
  searchBar.classList.remove('show');
});
menuToggler.addEventListener('click', () => {
  backdrop.classList.toggle('show');
  menu.classList.toggle('show');
});

// Search Bar Open and Close
searchBtnMob.addEventListener('click', () => {
  backdrop.classList.toggle('show');
  searchBar.classList.toggle('show');
});

searchBtnMain.addEventListener('click', () => {
  backdrop.classList.toggle('show');
  searchBar.classList.toggle('show');
});
