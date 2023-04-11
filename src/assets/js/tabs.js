/*active button class onclick*/
export function Tabs() {
$('nav a').click(function(e) {
    e.preventDefault();
    $('nav a').removeClass('active');
    $(this).addClass('active');
    if(this.id === !'étage1'){
      $('.étage1').addClass('noshow');
    }
    else if(this.id === 'étage1') {
      $('.étage1').removeClass('noshow');
      $('.rightbox').children().not('.étage1').addClass('noshow');
    }
    else if (this.id === 'rdc') {
      $('.rdc').removeClass('noshow');
       $('.rightbox').children().not('.rdc').addClass('noshow');
    }
    else if(this.id === 'étage2') {
      $('.étage2').removeClass('noshow');
      $('.rightbox').children().not('.étage2').addClass('noshow');
    }
      else if(this.id === 'étage3') {
      $('.étage3').removeClass('noshow');
      $('.étage3').children().not('.étage3').addClass('noshow');
    }
    else if(this.id === 'étage4') {
      $('.étage4').removeClass('noshow');
      $('.rightbox').children().not('.étage4').addClass('noshow');
    }
  });
}