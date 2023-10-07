const createUserHtml = (userInfo) => {
    if(!userInfo){
        return ``;
    }
    const element = document.createElement("div");
    element.classList.add("userWrapper");

    element.innerHTML =  `<img src = ${userInfo.picture} alt = ${userInfo.picture} />
        <span>
        phone: ${userInfo.phone}
        </span>
        <span>
        longitude: ${userInfo.coordinates?.longitude}
        </span>
        <span>
        latitude: ${userInfo.coordinates?.latitude}
        </span>
        <span>
        postcode: ${userInfo.postcode}
        </span>
        <span>
        country: ${userInfo.country}
        </span>`

    return element;
}

const createSpinner = () => {
    const spinner = document.createElement("div");
    spinner.classList.add("lds-default");
    for (let index = 0; index < 12; index++) {
        const element = document.createElement("div");
        spinner.appendChild(element);
    }
    return spinner;
}

async function requestUser() {
    const response = await fetch('https://randomuser.me/api');
    const data = await response.json();;
    const info = data?.results[0];
    if(!info){
        return {};
    }
    return {
        picture: info.picture.medium,
        phone: info.phone,
        coordinates: info.location?.coordinates,
        postcode: info.location?.postcode,
        country: info.location?.country
    };
}

async function download(){
    const spinner = createSpinner();
    const main = document.getElementById("mainId");

    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }
    
    main.appendChild(spinner);
    const usersPromises = []
    for (let index = 0; index < 5; index++) {
        usersPromises.push(requestUser());
    }
    const users = await Promise.all(usersPromises);
    main.removeChild(spinner);
    for (let index = 0; index < users.length; index++) {
        const userInfo = users[index];
        main.appendChild(createUserHtml(userInfo));
    }
}