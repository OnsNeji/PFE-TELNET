/*active button class onclick*/
export function Tabs() {

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Menu isotope and filter
   */
  window.addEventListener('load', () => {
    let menuContainer = select('.menu-container');
    if (menuContainer) {
      let menuIsotope = new Isotope(menuContainer, {
        itemSelector: '.menu-item',
        layoutMode: 'fitRows'
      });
  
      let menuFilters = select('#menu-flters li', true);
  
      // Ajoutez le code ci-dessous pour filtrer les utilisateurs du rez-de-chaussée par défaut
      let defaultFilter = '.rdc';
      let defaultFilterElement = select(`[data-filter="${defaultFilter}"]`);
      defaultFilterElement.classList.add('filter-active');
  
      menuIsotope.arrange({
        filter: defaultFilter
      });
  
      // Fin du code ajouté
  
      on('click', '#menu-flters li', function(e) {
        e.preventDefault();
        menuFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');
  
        menuIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }
  });
  


// $('nav a').click(function(e) {
//     e.preventDefault();
//     $('nav a').removeClass('active');
//     $(this).addClass('active');
//     if(this.id === !'étage1'){
//       $('.étage1').addClass('noshow');
//     }
//     else if(this.id === 'étage1') {
//       $('.étage1').removeClass('noshow');
//       $('.rightbox').children().not('.étage1').addClass('noshow');
//     }
//     else if (this.id === 'rdc') {
//       $('.rdc').removeClass('noshow');
//        $('.rightbox').children().not('.rdc').addClass('noshow');
//     }
//     else if(this.id === 'étage2') {
//       $('.étage2').removeClass('noshow');
//       $('.rightbox').children().not('.étage2').addClass('noshow');
//     }
//       else if(this.id === 'étage3') {
//       $('.étage3').removeClass('noshow');
//       $('.rightbox').children().not('.étage3').addClass('noshow');
//     }
//     else if(this.id === 'étage4') {
//       $('.étage4').removeClass('noshow');
//       $('.rightbox').children().not('.étage4').addClass('noshow');
//     }
//   });


}