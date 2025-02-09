class BooksList{
  constructor(){
    this.favoriteBooks = [];
    this.filters = [];

    this.initData();
    this.getElements();
    this.render();
    this.initActions();
  }

  initData(){
    this.data = dataSource.books;
  }

  getElements(){
    this.booksList = document.querySelector('.books-list');
    this.form = document.querySelector('.filters');
  }

  render(){
    // Pobranie referencji do listy ksiazek i szablonu
    const template = Handlebars.compile(document.querySelector('#template-book').innerHTML);
    
    // Iteracja po wszystkich ksiazkach w dataSource.books za pomoca petli for
    for (let i = 0; i < this.data.length; i++) {
      const book = this.data[i]; // Pobranie ksiazki
      //const html = template(book); // Wygenerowanie HTML na podstawie szablonu

      const ratingBgc = this.determineRatingBgc(book.rating);
      const ratingWidth = book.rating*10;
      // Wygenerowanie HTML na podstawie szablonu, przekazujac dodatkowe dane
      //const html = template({...book, ratingWidth, ratingBgc });
      const html = template(Object.assign({}, book, { ratingWidth, ratingBgc }));
      
      // Utworzenie elementu DOM
      const element = document.createElement('div');
      element.innerHTML = html;
    
      // Dodanie wygenerowanego elementu do listy ksiazek
      this.booksList.appendChild(element.firstElementChild);
    }
  }
  
  initActions(){
    this.booksList.addEventListener('dblclick', function(event) {
      event.preventDefault();

      //const clikedElement = event.target.offsetParent;
      const clikedElement = event.target.closest('.book__image');

      if(clikedElement && clikedElement.classList.contains('book__image')){
        event.stopPropagation();

        const bookId = clikedElement.getAttribute('data-id');
        if(!this.favoriteBooks.includes(bookId)){
          clikedElement.classList.add('favorite');
          this.favoriteBooks.push(bookId);
        } else {
          clikedElement.classList.remove('favorite');
          this.favoriteBooks.splice(this.favoriteBooks.indexOf(bookId), 1);
        }
      }
    }.bind(this));

    //const form = document.querySelector('.filters');
    this.form.addEventListener('change', (event) => {
      event.preventDefault();

      if(event.target.tagName==='INPUT' && event.target.name==='filter' && event.target.type==='checkbox'){

        const filterValue = event.target.value;
        console.log(filterValue);

        if(event.target.checked){
          if(!this.filters.includes(filterValue)){
            this.filters.push(filterValue);
          }
        } else {
          const index = this.filters.indexOf(filterValue);
          if(index>-1){
            this.filters.splice(index, 1);
          }
        }
        this.filterBooks();
      }
    });
  }

  filterBooks(){

    for(const book of this.data) {
      let shouldBeHidden = false;

      for(const filter of this.filters){
        if (!book.details[filter]){
          shouldBeHidden = true;
          break;
        }
      }
      const bookElement = document.querySelector(`.book__image[data-id="${book.id}"]`);
      if(shouldBeHidden){
        bookElement.classList.add('hidden');
      } else {
        bookElement.classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating){
    if (rating<6){
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    }
    if (rating>6 && rating<=8){
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    }
    if (rating>8 && rating <=9){
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    }
    if (rating>9){
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
}
// eslint-disable-next-line no-unused-vars
const app = new BooksList();