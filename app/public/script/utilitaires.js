
var taille_page = 10; // Nombre de lignes par page
function filtrerTableau({ idRowsSelector, filters = null, checkboxFilters = null, filtres_customs = null, nb_page = null, taille_page = 10 }) {
    const rows = document.querySelectorAll(idRowsSelector);

    function normalize(str) {
        return str.toLowerCase().trim();
    }

    let compteur = 0;   
    let fenetre_min = null;
    let fenetre_max = null; 
    if (nb_page !== null) {
        fenetre_min = nb_page * taille_page-taille_page;
        fenetre_max = nb_page * taille_page; 
    }
    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        let visible = true;
        
        for (let key in filters) {
            const input = filters[key].element;
            const colIndex = filters[key].colIndex;
            const userValue = normalize(columns[colIndex]?.innerText || '');
            const filterValue = normalize(input.value);
            if (filterValue && !userValue.includes(filterValue)) {
                visible = false;
                break;
            }
        }
        
        for (let key in filters) {
            const input = filters[key].element;
            const colIndex = filters[key].colIndex;
            const userValue = normalize(columns[colIndex]?.innerText || '');
            const filterValue = normalize(input.value);
            if (filterValue && !userValue.includes(filterValue)) {
                visible = false;
                break;
            }
        }

        
        if (visible && filtres_customs) {
            for (let filtres_custom of filtres_customs) {
                if (!eval(filtres_custom.check_function)(filtres_custom.element, row)) {
                    visible = false;
                    break;
                }
            } 
        }
        
        if (visible && checkboxFilters) {
            for (let checkboxFilter of checkboxFilters) {
                if (!eval(checkboxFilter.check_function)(checkboxFilter.element, row)) {
                    console.log("Checkbox filter failed for row: ", row);
                    console.log("Checkbox filter function: ", checkboxFilter.check_function);
                    visible = false;
                    break;
                }
            } 
        }
        
        
        if (visible && nb_page !== null) {
            if (compteur < fenetre_min || compteur >= fenetre_max) {
                visible = false;
            }
            compteur++;
        }
        row.style.display = visible ? '' : 'none';

    });
}


