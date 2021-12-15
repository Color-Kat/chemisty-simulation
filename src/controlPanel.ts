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