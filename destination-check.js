const checker = document.querySelector("[data-destination-checker]");

const destinationRows = `
Abu Dhabi|AE|G|230 V|50 Hz|no
Afghanistan|AF|C, F|230 V|50 Hz|direct
Albania|AL|C, F|230 V|50 Hz|direct
Algeria|DZ|C, F|230 V|50 Hz|direct
American Samoa|AS|A, B|120 V|60 Hz|no
Andorra|AD|C, F|230 V|50 Hz|direct
Angola|AO|C, F|230 V|50 Hz|direct
Anguilla|AI|A, B|110 V|60 Hz|no
Antigua and Barbuda|AG|A, B|110 V / 220 V|60 Hz|no
Argentina|AR|I|230 V|50 Hz|no
Armenia|AM|C, F|230 V|50 Hz|direct
Aruba|AW|A, B|120 V|60 Hz|no
Australia|AU|I|230 V (officially, but in practice often 240 V)|50 Hz|no
Austria|AT|C, F|230 V|50 Hz|direct
Azerbaijan|AZ|C, F|230 V|50 Hz|direct
Azores|PT|C, F|230 V|50 Hz|direct
Bahamas|BS|A, B|120 V|60 Hz|no
Bahrain|BH|G|230 V|50 Hz|no
Balearic Islands|ES|C, F|230 V|50 Hz|direct
Bangladesh|BD|A, C, D, M, G|230 V|50 Hz|mixed
Barbados|BB|A, B|115 V|50 Hz|no
Belarus|BY|C, F|230 V|50 Hz|direct
Belgium|BE|C, E|230 V|50 Hz|direct
Belize|BZ|A, B|110 V|60 Hz|no
Benin|BJ|C, E|230 V|50 Hz|direct
Bermuda|BM|A, B|120 V|60 Hz|no
Bhutan|BT|C, D, M|230 V|50 Hz|mixed
Bolivia|BO|A, B, C|230 V|50 Hz|mixed
Bonaire|BQ|A, B, C, F|127 V (types A & B) / 220 V (types C & F)|50 Hz|mixed
Bosnia & Herzegovina|BA|C, F|230 V|50 Hz|direct
Botswana|BW|M|230 V|50 Hz|no
Brazil|BR|C, N|127 V / 220 V|60 Hz|mixed
British Virgin Islands|VG|A, B|110 V|60 Hz|no
Brunei|BN|G|240 V|50 Hz|no
Bulgaria|BG|C, F|230 V|50 Hz|direct
Burkina Faso|BF|C, E|230 V|50 Hz|direct
Burundi|BI|C, E|230 V|50 Hz|direct
Cabo Verde|CV|C, F|230 V|50 Hz|direct
Cambodia|KH|A, B, C, F, G|230 V|50 Hz|mixed
Cameroon|CM|C, E|230 V|50 Hz|direct
Canada|CA|A, B|120 V|60 Hz|no
Canary Islands|ES|C, F|230 V|50 Hz|direct
Cayman Islands|KY|A, B|120 V|60 Hz|no
Central African Republic|CF|C, E|230 V|50 Hz|direct
Chad|TD|C, E, F|230 V|50 Hz|direct
Chile|CL|C, L|230 V|50 Hz|mixed
China|CN|A, I|230 V|50 Hz|no
Christmas Island|CX|I|230 V|50 Hz|no
Cocos|CC|I|230 V|50 Hz|no
Colombia|CO|A, B|110 V|60 Hz|no
Comoros|KM|C, E|230 V|50 Hz|direct
Cook Islands|CK|I|240 V|50 Hz|no
Costa Rica|CR|A, B|120 V|60 Hz|no
Croatia|HR|C, F|230 V|50 Hz|direct
Cuba|CU|A, B|120 V|60 Hz|no
Curaçao|CW|A, B|127 V|50 Hz|no
Cyprus|CY|G|230 V|50 Hz|no
Cyprus, North|CY|G|230 V|50 Hz|no
Czechia|CZ|C, E|230 V|50 Hz|direct
Côte d’Ivoire|CI|C, E|230 V|50 Hz|direct
Democratic Republic of the Congo|CD|C, E|230 V|50 Hz|direct
Denmark|DK|C, F, K|230 V|50 Hz|mixed
Djibouti|DJ|C, E|230 V|50 Hz|direct
Dominica|DM|G|230 V|50 Hz|no
Dominican Republic|DO|A, B|120 V|60 Hz|no
Dubai|AE|G|230 V|50 Hz|no
Ecuador|EC|A, B|120 V|60 Hz|no
Egypt|EG|C, F|230 V|50 Hz|direct
El Salvador|SV|A, B|120 V|60 Hz|no
England|GB|G|230 V|50 Hz|no
Equatorial Guinea|GQ|C, E|230 V|50 Hz|direct
Eritrea|ER|C, E, L|230 V|50 Hz|mixed
Estonia|EE|C, F|230 V|50 Hz|direct
Eswatini|SZ|C, M, N|230 V|50 Hz|mixed
Ethiopia|ET|C, F, G|230 V|50 Hz|mixed
Falkland Islands|FK|G|240 V|50 Hz|no
Faroe Islands|FO|C, F, K|230 V|50 Hz|mixed
Fiji|FJ|I|240 V|50 Hz|no
Finland|FI|C, F|230 V|50 Hz|direct
France|FR|C, E|230 V|50 Hz|direct
French Guiana|GF|C, E|230 V|50 Hz|direct
French Polynesia|PF|C, E|230 V|60 Hz|direct
Gabon|GA|C, E|230 V|50 Hz|direct
Gambia|GM|G|230 V|50 Hz|no
Gaza|PS|C, H|230 V|50 Hz|mixed
Georgia|GE|C, F|230 V|50 Hz|direct
Germany|DE|C, F|230 V|50 Hz|direct
Ghana|GH|G|230 V|50 Hz|universal
Gibraltar|GI|G|230 V|50 Hz|no
Great Britain|GB|G|230 V|50 Hz|no
Greece|GR|C, F|230 V|50 Hz|direct
Greenland|GL|C, F, K|230 V|50 Hz|mixed
Grenada|GD|G|230 V|50 Hz|no
Guadeloupe|GP|C, E|230 V|50 Hz|direct
Guam|GU|A, B|110 V|60 Hz|no
Guatemala|GT|A, B|120 V|60 Hz|no
Guernsey|GG|G|230 V|50 Hz|no
Guinea|GN|C, F|230 V|50 Hz|direct
Guinea-Bissau|GW|C, F|230 V|50 Hz|direct
Guyana|GY|A, B|110 V / 220 V|50 Hz / 60 Hz|no
Haiti|HT|A, B|110 V|60 Hz|no
Honduras|HN|A, B|120 V|60 Hz|no
Hong Kong|HK|G|230 V|50 Hz|no
Hungary|HU|C, F|230 V|50 Hz|direct
Iceland|IS|C, F|230 V|50 Hz|direct
India|IN|D, M|230 V|50 Hz|no
Indonesia|ID|C, F|230 V|50 Hz|direct
Iran|IR|C, F|230 V|50 Hz|direct
Iraq|IQ|C, G|230 V|50 Hz|mixed
Ireland|IE|G|230 V|50 Hz|no
Ireland, Northern|GB|G|230 V|50 Hz|no
Isle of Man|IM|G|230 V|50 Hz|no
Israel|IL|C, H|230 V|50 Hz|mixed
Italy|IT|C, F, L|230 V|50 Hz|mixed
Jamaica|JM|A, B|110 V|50 Hz|no
Japan|JP|A, B|100 V|50 Hz / 60 Hz|no
Jersey|JE|G|230 V|50 Hz|no
Jordan|JO|C, F, G|230 V|50 Hz|mixed
Kazakhstan|KZ|C, F|230 V|50 Hz|direct
Kenya|KE|G|240 V|50 Hz|no
Kiribati|KI|I|240 V|50 Hz|no
Kosovo|XK|C, F|230 V|50 Hz|direct
Kuwait|KW|G|230 V|50 Hz|no
Kyrgyzstan|KG|C, F|230 V|50 Hz|direct
Laos|LA|A, B, C|230 V|50 Hz|mixed
Latvia|LV|C, F|230 V|50 Hz|direct
Lebanon|LB|C, F|230 V|50 Hz|direct
Lesotho|LS|M|230 V|50 Hz|no
Liberia|LR|C, D, F, G|230 V|50 Hz|mixed
Libya|LY|C, F, L|230 V|50 Hz|mixed
Liechtenstein|LI|C, J|230 V|50 Hz|mixed
Lithuania|LT|C, F|230 V|50 Hz|direct
Luxembourg|LU|C, F|230 V|50 Hz|direct
Macau|MO|G|230 V|50 Hz|no
Madagascar|MG|C, E|230 V|50 Hz|direct
Madeira|PT|C, F|230 V|50 Hz|direct
Malawi|MW|G|230 V|50 Hz|no
Malaysia|MY|G|230 V (officially, but in practice often 240 V)|50 Hz|no
Maldives|MV|C, D, G|230 V|50 Hz|mixed
Mali|ML|C, E|230 V|50 Hz|direct
Malta|MT|G|230 V|50 Hz|no
Marshall Islands|MH|A, B|120 V|60 Hz|no
Martinique|MQ|C, E|230 V|50 Hz|direct
Mauritania|MR|C, E|230 V|50 Hz|direct
Mauritius|MU|C, E, G|230 V|50 Hz|mixed
Mayotte|YT|C, E|230 V|50 Hz|direct
Mexico|MX|A, B|127 V|60 Hz|no
Moldova|MD|C, F|230 V|50 Hz|direct
Monaco|MC|C, E|230 V|50 Hz|direct
Mongolia|MN|C, F|230 V|50 Hz|direct
Montenegro|ME|C, F|230 V|50 Hz|direct
Montserrat|MS|A, B, G|230 V|60 Hz|no
Morocco|MA|C, E|230 V|50 Hz|direct
Mozambique|MZ|C, F, M, N|230 V|50 Hz|mixed
Myanmar|MM|A, B, C, D, E, F, G, I|230 V|50 Hz|mixed
Namibia|NA|C, M, N|230 V|50 Hz|mixed
Nauru|NR|I|240 V|50 Hz|no
Nepal|NP|C, D, M|230 V|50 Hz|mixed
Netherlands|NL|C, F|230 V|50 Hz|direct
New Caledonia|NC|C, E|230 V|50 Hz|direct
New Zealand|NZ|I|230 V|50 Hz|no
Nicaragua|NI|A, B|120 V|60 Hz|no
Niger|NE|C, E|230 V|50 Hz|direct
Nigeria|NG|G|230 V|50 Hz|universal
Niue|NU|I|230 V|50 Hz|no
Norfolk Island|NF|I|230 V|50 Hz|no
North Cyprus|CY|G|230 V|50 Hz|no
North Korea|KP|C, F|230 V|50 Hz|direct
North Macedonia|MK|C, F|230 V|50 Hz|direct
Northern Ireland|GB|G|230 V|50 Hz|no
Norway|NO|C, F|230 V|50 Hz|direct
Oman|OM|G|230 V|50 Hz|no
Pakistan|PK|C, D|230 V|50 Hz|mixed
Palau|PW|A, B|120 V|60 Hz|no
Palestine|PS|C, H|230 V|50 Hz|mixed
Panama|PA|A, B|120 V|60 Hz|no
Papua New Guinea|PG|I|240 V|50 Hz|no
Paraguay|PY|A, B, C, N|230 V|50 Hz|mixed
Peru|PE|A, B, C|230 V|60 Hz|mixed
Philippines|PH|A, B, C|230 V|60 Hz|mixed
Pitcairn Islands|PN|I|230 V|50 Hz|no
Poland|PL|C, E|230 V|50 Hz|direct
Portugal|PT|C, F|230 V|50 Hz|direct
Puerto Rico|PR|A, B|120 V|60 Hz|no
Qatar|QA|G|240 V|50 Hz|no
Republic of the Congo|CG|C, E|230 V|50 Hz|direct
Romania|RO|C, F|230 V|50 Hz|direct
Russia|RU|C, F|230 V|50 Hz|direct
Rwanda|RW|C, E, F, G|230 V|50 Hz|mixed
Réunion|RE|C, E|230 V|50 Hz|direct
Saba|BQ|A, B|110 V|60 Hz|no
Saint Barthélemy|BL|C, E|230 V|60 Hz|direct
Saint Helena|SH|G|230 V|50 Hz|no
Saint Kitts and Nevis|KN|A, B, G|230 V|60 Hz|no
Saint Lucia|LC|G|230 V|50 Hz|no
Saint Martin|MF|C, E|230 V|60 Hz|direct
Saint Pierre and Miquelon|PM|C, E|230 V|50 Hz|direct
Saint Vincent and the Grenadines|VC|A, B, G|230 V (Petit Saint Vincent: 110 V)|50 Hz (Petit Saint Vincent: 60 Hz)|no
Samoa|WS|I|230 V|50 Hz|no
San Marino|SM|C, F, L|230 V|50 Hz|mixed
Saudi Arabia|SA|G|230 V|60 Hz|no
Scotland|GB|G|230 V|50 Hz|no
Senegal|SN|C, E|230 V|50 Hz|direct
Serbia|RS|C, F|230 V|50 Hz|direct
Seychelles|SC|G|240 V|50 Hz|no
Sierra Leone|SL|G|230 V|50 Hz|no
Singapore|SG|G|230 V|50 Hz|no
Sint Eustatius|BQ|A, B|110 V|60 Hz|no
Sint Maarten|SX|A, B|110 V|60 Hz|no
Slovakia|SK|C, E|230 V|50 Hz|direct
Slovenia|SI|C, F|230 V|50 Hz|direct
Solomon Islands|SB|I|230 V|50 Hz|no
Somalia|SO|C, G|230 V|50 Hz|mixed
Somaliland|SO|C, G|230 V|50 Hz|mixed
South Africa|ZA|C, M, N|230 V|50 Hz|mixed
South Korea|KR|C, F|230 V|60 Hz|direct
South Sudan|SS|C, D, G|230 V|50 Hz|mixed
Spain|ES|C, F|230 V|50 Hz|direct
Sri Lanka|LK|G|230 V|50 Hz|no
Sudan|SD|C, D, G|230 V|50 Hz|mixed
Suriname|SR|A, B|110 V|60 Hz|no
Sweden|SE|C, F|230 V|50 Hz|direct
Switzerland|CH|C, J|230 V|50 Hz|mixed
Syria|SY|C, E, F, L|230 V|50 Hz|mixed
São Tomé and Príncipe|ST|C, F|230 V|50 Hz|direct
Tahiti|PF|C, E|230 V|60 Hz|direct
Taiwan|TW|A, B|110 V|60 Hz|no
Tajikistan|TJ|C, F|230 V|50 Hz|direct
Tanzania|TZ|G|230 V|50 Hz|no
Thailand|TH|A, B, C, O|230 V|50 Hz|mixed
Timor-Leste|TL|C, E, F, I|230 V|50 Hz|mixed
Togo|TG|C, E|230 V|50 Hz|direct
Tokelau|TK|I|230 V|50 Hz|no
Tonga|TO|I|240 V|50 Hz|no
Trinidad & Tobago|TT|A, B|115 V|60 Hz|no
Tunisia|TN|C, E|230 V|50 Hz|direct
Turkey|TR|C, F|230 V|50 Hz|direct
Turkmenistan|TM|C, F|230 V|50 Hz|direct
Turks and Caicos Islands|TC|A, B|120 V|60 Hz|no
Tuvalu|TV|I|230 V|50 Hz|no
Uganda|UG|G|240 V|50 Hz|no
Ukraine|UA|C, F|230 V|50 Hz|direct
United Arab Emirates|AE|G|230 V|50 Hz|no
United Kingdom|GB|G|230 V|50 Hz|no
United States Virgin Islands|VI|A, B|110 V|60 Hz|no
United States|US|A, B|120 V|60 Hz|no
Uruguay|UY|C, F, L|230 V|50 Hz|mixed
Uzbekistan|UZ|C, F|230 V|50 Hz|direct
Vanuatu|VU|I|230 V|50 Hz|no
Vatican City|VA|C, F, L|230 V|50 Hz|mixed
Venezuela|VE|A, B|120 V|60 Hz|no
Vietnam|VN|A, B, C|230 V|50 Hz|mixed
Virgin Islands|VG|A, B|110 V|60 Hz|no
Wales|GB|G|230 V|50 Hz|no
Wallis and Futuna|WF|C, E|230 V|50 Hz|direct
West Bank|PS|C, H|230 V|50 Hz|mixed
Western Sahara|EH|C, E|230 V|50 Hz|direct
Yemen|YE|C, D, G|230 V|50 Hz|mixed
Zambia|ZM|G|230 V|50 Hz|no
Zimbabwe|ZW|G|230 V|50 Hz|no
`;

const destinationAliases = {
  "Bosnia & Herzegovina": "Bosnia Bosnia and Herzegovina",
  "Cabo Verde": "Cape Verde",
  "Côte d’Ivoire": "Ivory Coast Cote d Ivoire",
  Czechia: "Czech Republic",
  Eswatini: "Swaziland",
  Indonesia: "Bali",
  Myanmar: "Burma",
  Netherlands: "Holland",
  "United Kingdom": "UK Britain Great Britain England Scotland Wales Northern Ireland",
  "United States": "USA United States of America US America",
  "United Arab Emirates": "UAE Dubai Abu Dhabi",
  "Republic of the Congo": "Congo Brazzaville",
  "Democratic Republic of the Congo": "Congo Kinshasa DRC",
  "Timor-Leste": "East Timor",
};

function flagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}

const destinations = destinationRows
  .trim()
  .split("\n")
  .map((row) => {
    const [name, code, sockets, voltage, frequency, mode] = row.split("|");
    const aliases = destinationAliases[name] || "";
    return {
      name,
      code,
      sockets,
      voltage,
      frequency,
      mode,
      flag: flagEmoji(code),
      search: `${name} ${code} ${sockets} ${aliases}`.toLowerCase(),
    };
  });

if (checker) {
  const combobox = checker.querySelector("[data-destination-combobox]");
  const input = checker.querySelector("[data-destination-input]");
  const toggle = checker.querySelector("[data-destination-toggle]");
  const options = checker.querySelector("[data-destination-options]");
  const result = checker.querySelector("[data-destination-result]");
  const selectedFlag = checker.querySelector("[data-destination-selected-flag]");
  let filtered = destinations;
  let activeIndex = -1;
  let selectedDestination = null;

  function optionId(index) {
    return `destination-option-${index}`;
  }

  function setOpen(isOpen) {
    combobox.classList.toggle("is-open", isOpen);
    input.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen) input.removeAttribute("aria-activedescendant");
  }

  function emptyResult(message = "Choose a destination to check compatibility") {
    result.classList.remove("is-populated", "is-yes", "is-no");
    result.classList.add("is-empty");
    const text = document.createElement("p");
    text.className = "destination-empty-message";
    text.textContent = message;
    result.replaceChildren(text);
  }

  function resultMessage(destination) {
    if (destination.mode === "no") {
      return `Roamboard is not designed to plug directly into the Type ${destination.sockets} wall sockets used in ${destination.name}.`;
    }
    if (destination.mode === "direct") {
      return `Roamboard is designed for Type ${destination.sockets} wall sockets in ${destination.name}.`;
    }
    if (destination.mode === "universal") {
      return `Some sockets in ${destination.name} are universal and may accept Type C, E or F plugs, but check your room before relying on it.`;
    }
    return `Roamboard works where Type C, E or F sockets are available. ${destination.name} also uses other socket types, so check your accommodation before you pack.`;
  }

  function showResult(destination) {
    result.classList.remove("is-empty");
    result.classList.toggle("is-yes", destination.mode !== "no");
    result.classList.toggle("is-no", destination.mode === "no");
    result.classList.add("is-populated");

    const summary = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${destination.flag} ${destination.name}`;
    const answer = document.createElement("span");
    answer.className = "destination-result-answer";
    answer.textContent = destination.mode === "no" ? "No." : "Yes.";
    summary.append(strong, answer, document.createTextNode(` ${resultMessage(destination)}`));

    const meta = document.createElement("div");
    meta.className = "destination-result-meta";
    [`Sockets ${destination.sockets}`, destination.voltage, destination.frequency].forEach((label) => {
      const chip = document.createElement("span");
      chip.textContent = label;
      meta.append(chip);
    });

    result.replaceChildren(summary, meta);
  }

  function renderOptions() {
    options.replaceChildren();

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "destination-option";
      empty.setAttribute("role", "option");
      empty.textContent = "No matching destinations found";
      options.append(empty);
      return;
    }

    filtered.forEach((destination, index) => {
      const option = document.createElement("button");
      option.className = "destination-option";
      option.type = "button";
      option.id = optionId(index);
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(index === activeIndex));
      option.dataset.index = String(index);
      option.addEventListener("pointerdown", (event) => event.preventDefault());
      option.addEventListener("click", () => selectDestination(destination));

      const flag = document.createElement("span");
      flag.className = "destination-option-flag";
      flag.textContent = destination.flag;

      const name = document.createElement("span");
      name.className = "destination-option-name";
      name.textContent = destination.name;

      const sockets = document.createElement("span");
      sockets.className = "destination-option-sockets";
      sockets.textContent = destination.sockets;

      option.append(flag, name, sockets);
      options.append(option);
    });
  }

  function setActiveIndex(nextIndex) {
    activeIndex = Math.max(0, Math.min(nextIndex, filtered.length - 1));
    options.querySelectorAll(".destination-option").forEach((option, index) => {
      const isActive = index === activeIndex;
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-selected", String(isActive));
      if (isActive) {
        input.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function filterOptions(query) {
    const normalizedQuery = query.trim().toLowerCase();
    filtered = normalizedQuery
      ? destinations.filter((destination) => destination.search.includes(normalizedQuery))
      : destinations;
    activeIndex = filtered.length ? 0 : -1;
    renderOptions();
    if (activeIndex >= 0) setActiveIndex(activeIndex);
  }

  function selectDestination(destination) {
    selectedDestination = destination;
    input.value = destination.name;
    selectedFlag.textContent = destination.flag;
    filterOptions(destination.name);
    showResult(destination);
    setOpen(false);
  }

  input.addEventListener("focus", () => {
    filterOptions(input.value);
    setOpen(true);
  });

  input.addEventListener("input", () => {
    selectedDestination = null;
    selectedFlag.textContent = "";
    filterOptions(input.value);
    setOpen(true);
    emptyResult(input.value ? "Choose a destination from the list" : undefined);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!combobox.classList.contains("is-open")) setOpen(true);
      setActiveIndex(activeIndex + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(activeIndex - 1);
    }

    if (event.key === "Enter" && activeIndex >= 0 && filtered[activeIndex]) {
      event.preventDefault();
      selectDestination(filtered[activeIndex]);
    }

    if (event.key === "Escape") {
      setOpen(false);
      if (selectedDestination) input.value = selectedDestination.name;
    }
  });

  toggle.addEventListener("click", () => {
    const isOpen = combobox.classList.contains("is-open");
    filterOptions(input.value);
    setOpen(!isOpen);
    input.focus();
  });

  document.addEventListener("click", (event) => {
    if (!checker.contains(event.target)) setOpen(false);
  });

  renderOptions();
}
