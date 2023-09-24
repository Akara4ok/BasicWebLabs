const table = document.createElement("table");
const colorPicker = document.getElementById("colorPicker");

getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}


for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 6; j++) {
        const cell = document.createElement("td");
        cell.textContent = i * 6 + j;
        if(i * 6 + j == 53 % 36){
            cell.addEventListener("mouseover", () => {
                cell.style.backgroundColor = getRandomColor();
            });
            cell.addEventListener("click", () => {
                valuesToChange.length = 0;
                valuesToChange.push({x: j, y: i});
                setTimeout(() => {
                    colorPicker.click();
                }, 500);
            });
            cell.addEventListener("dblclick", () => {
                valuesToChange.length = 0;
                for (let index = 0; index < 6; index++) {
                    valuesToChange.push({x: index, y: index});
                }
                colorPicker.click();
            })
        }
        row.appendChild(cell);
    }
    table.appendChild(row);
}

const valuesToChange = [];

// Додаємо таблицю на сторінку
document.body.appendChild(table);

colorPicker.addEventListener("change", () => {
    for (let index = 0; index < valuesToChange.length; index++) {
        const element = valuesToChange[index];
        table.rows[element.y].cells[element.x].style.backgroundColor = colorPicker.value;
    }
});