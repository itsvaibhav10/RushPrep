// Toggle
function togglePass() {
  const x = document.getElementById('password');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
}

const filterInput = (inputSel, listSel, elementSel) => {
  // Filter List
  const filterInput = document.querySelector(inputSel);
  if (filterInput) {
    filterInput.addEventListener('keyup', () => {
      let filterValue = filterInput.value.toUpperCase();
      const list = document.querySelectorAll(listSel);
      for (let item = 0; item < list.length; item++) {
        let element = list[item].querySelector(elementSel);
        if (element.textContent.toUpperCase().indexOf(filterValue) > -1) {
          list[item].parentElement.classList.remove('hide');
        } else {          
          list[item].parentElement.classList.add('hide');
        }
      }
    });
  }
};

// filterInput(
//   '#masterSubject #categorySearchInput',
//   '#masterSubject .element',
//   'h3'
// );
filterInput(
  '#masterCollege #categorySearchInput',
  '#masterCollege .element',
  'h3'
);
