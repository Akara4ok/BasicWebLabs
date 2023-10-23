const regexes =
    [/^[A-Z][a-z]+ [A-Z]\.[A-Z]\.$/,
        /^[A-Za-z]{2}-\d{2}$/, 
        /^[A-Z]{2} №\d{6}$/,
        /^\d{2}\.\d{2}\.\d{4}$/,
        /^[A-Za-z0-9]+@[A-Za-z]+\.com$/];

const inputs =
    [document.getElementById("nameInput"),
    document.getElementById("groupInput"),
    document.getElementById("idcardInput"),
    document.getElementById("dateInput"),
    document.getElementById("emailInput")];

const dataToShow = document.getElementById("dataId");
dataToShow.remove();

document.getElementById("submitBtn").onclick = (event) => {
    event.preventDefault();
    console.log("hello");

    let allPased = true;
    const values = [];
    dataToShow.remove();
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.style.borderColor = "black";
        if(!regexes[index].test(element.value)){
            allPased = false;
            element.style.borderColor = "red";
            continue;
        }
        values.push(element.value);
    }
    if(allPased){
        document.getElementById("mainId").append(dataToShow);
        for (let index = 0; index < inputs.length; index++) {
            const child = dataToShow.children[index];
            let span = document.createElement("span");
            span.append(values[index]);
            if(child.children.length > 1){
                child.removeChild(child.children[1]);
            }
            child.append(span);
        }
    }
};