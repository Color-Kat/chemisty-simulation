import atomsList from "./atomsList";

export default function (panel: HTMLElement, callback: (id: number)=> void){
    let list: any = atomsList;

    for (let i in list){
        let atom = list[i];

        let atomElem = document.createElement('div');
        atomElem.classList.add('chem_elem');

        let radio = document.createElement("INPUT");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "chemical_elements");
        radio.setAttribute("id", atom.name);
        radio.setAttribute("value", i);

        atomElem.append(radio);
        atomElem.innerHTML += `<h1>${atom.name}</h1>`;
        atomElem.innerHTML += `<h2>${atom.Z}</h2>`;

        if(+i === 0) {
            atomElem.classList.add('checked');
            callback((radio as any).value);
            radio.setAttribute('checked', '');
        }

            // atomElem.innerHTML = `<h3>${atom.name}</h3><br><h5>${atom.Z}</h5>`;
        // <div class="chem_elem">
        //      <input type="radio" value="H" name="chemical_elements" id="H">
        //     <h1>H</h1>
        //     <h2>1</h2>
        // </div>
        panel.append(atomElem);
    }

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function (){
            callback(this.value);
            document.querySelectorAll('.chem_elem').forEach(elem => {
                elem.classList.remove('checked');
            });
            this.parentElement.classList.add('checked');
        })
    })
}