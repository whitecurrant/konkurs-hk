import React from 'react';

export default () => (
  <div style={{ width: '50%', margin: '0 auto' }}>
    <p style={{ fontSize: 13 }}>
      Plik <a href="https://pl.wikipedia.org/wiki/CSV_(format_pliku)">.csv</a> powinien zwierać 3 kolumny - autora, opis zdjęcia oraz link do niego (zdjęcia powinny znajdować się w udostępnionym albumie Google Photos).
    Przykładowa struktura pliku:</p><br />
    <pre style={{ padding: 5 }}>
      Imię nazwisko,opis,https://lh3.googleusercontent.com/...
        <br />
      Ktoś inny,fajna fotka,https://lh3.googleusercontent.com/...
        <br />
      ...
      </pre>
    <p style={{ fontSize: 13 }}>
      Należy uważać, aby tworząc ręcznie plik nie używać przecinka w innym miejscu poza rozdzieleniem kolumn.
        Najłatwiej stworzyć plik np. w Excelu (wpisać dane do 3 kolumn kolumn) i zapisać jako .csv.<br />
      Link usyskujemy przeglądając album Google Photos, wybierając dane zdjęcie i pod prawym przyciskiem myszy wybierając kopiowanie linku do danego obrazka.<br />
      Długość linku nie ma znaczenia.
      </p>

    <p style={{ fontSize: 13 }}>
      Ewentualne pytania: mcn.adamczyk@gmail.com
      </p>
  </div>
);
