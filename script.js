const $ = (id) => document.getElementById(id);


const numberValue = (id) => {
    return Math.max(
        0,
        Number($(id).value) || 0
    );
};


const isChecked = (id) => {
    return $(id).checked;
};


const formatMoney = (value) => {
    return new Intl.NumberFormat("uz-UZ", {
        maximumFractionDigits: 2
    }).format(value);
};


const getGender = () => {
    return document.querySelector(
        'input[name="gender"]:checked'
    ).value;
};


/* =========================
   MOBILE MENU
========================= */

const mobileMenuButton =
    $("mobileMenuButton");

const mobileMenu =
    $("mobileMenu");


mobileMenuButton.addEventListener(
    "click",
    () => {
        mobileMenu.classList.toggle("active");
    }
);


document
    .querySelectorAll(".mobile-menu a")
    .forEach((link) => {

        link.addEventListener(
            "click",
            () => {
                mobileMenu.classList.remove(
                    "active"
                );
            }
        );

    });


/* =========================
   GENDER
========================= */

document
    .querySelectorAll(
        'input[name="gender"]'
    )
    .forEach((radio) => {

        radio.addEventListener(
            "change",
            updateSpouse
        );

    });


function updateSpouse() {

    const female =
        getGender() === "female";

    $("spouseLabel").textContent =
        female
            ? "Er"
            : "Xotin";


    $("spouse").max =
        female ? 1 : 4;


    const current =
        Number($("spouse").value);


    if (
        current >
        Number($("spouse").max)
    ) {
        $("spouse").value =
            $("spouse").max;
    }

}


/* =========================
   EXAMPLE
========================= */

$("example").addEventListener(
    "click",
    () => {

        $("estate").value =
            100000000;

        $("funeral").value =
            2000000;

        $("debts").value =
            5000000;

        $("wasiyyah").value =
            0;


        document.querySelector(
            'input[name="gender"][value="male"]'
        ).checked = true;


        $("spouse").value = 1;

        $("sons").value = 2;

        $("daughters").value = 1;

        $("father").checked = true;

        $("mother").checked = true;

        $("grandfather").checked = false;

        $("grandmother").value = 0;

        $("fullBrothers").value = 0;

        $("fullSisters").value = 0;

        $("maternalSiblings").value = 0;


        updateSpouse();

        calculate();

    }
);


/* =========================
   CALCULATE
========================= */

$("calculate").addEventListener(
    "click",
    calculate
);


function calculate() {

    const gross =
        numberValue("estate");


    const funeral =
        Math.min(
            numberValue("funeral"),
            gross
        );


    const remainingAfterFuneral =
        Math.max(
            0,
            gross - funeral
        );


    const debts =
        Math.min(
            numberValue("debts"),
            remainingAfterFuneral
        );


    const afterDebts =
        Math.max(
            0,
            remainingAfterFuneral - debts
        );


    /*
     * For this educational prototype,
     * wasiyyah is limited to 1/3.
     */

    const enteredWasiyyah =
        numberValue("wasiyyah");


    const wasiyyah =
        Math.min(
            enteredWasiyyah,
            afterDebts / 3
        );


    const netEstate =
        Math.max(
            0,
            afterDebts - wasiyyah
        );


    const sons =
        numberValue("sons");


    const daughters =
        numberValue("daughters");


    const spouse =
        numberValue("spouse");


    const father =
        isChecked("father");


    const mother =
        isChecked("mother");


    const grandfather =
        isChecked("grandfather");


    const grandmother =
        numberValue("grandmother");


    const fullBrothers =
        numberValue("fullBrothers");


    const fullSisters =
        numberValue("fullSisters");


    const maternalSiblings =
        numberValue("maternalSiblings");


    const descendants =
        sons + daughters > 0;


    const results = [];

    const warnings = [];


    /*
     * =========================
     * SPOUSE
     * =========================
     */

    if (spouse > 0) {

        const share =
            descendants
                ? 1 / 8
                : 1 / 4;


        results.push({
            name:
                getGender() === "male"
                    ? "Xotin"
                    : "Er",

            count:
                spouse,

            share,
            source:
                "Niso 4:12"
        });

    }


    /*
     * =========================
     * MOTHER
     * =========================
     */

    if (mother) {

        const hasMultipleSiblings =
            fullBrothers +
            fullSisters +
            maternalSiblings >= 2;


        const share =
            descendants ||
            hasMultipleSiblings
                ? 1 / 6
                : 1 / 3;


        results.push({
            name: "Ona",

            count: 1,

            share,

            source:
                "Niso 4:11"
        });

    }


    /*
     * =========================
     * FATHER
     * =========================
     */

    if (
        father &&
        descendants
    ) {

        results.push({
            name: "Ota",

            count: 1,

            share: 1 / 6,

            source:
                "Niso 4:11"
        });

    }


    /*
     * =========================
     * DAUGHTERS ONLY
     * =========================
     */

    if (
        daughters > 0 &&
        sons === 0
    ) {

        const share =
            daughters === 1
                ? 1 / 2
                : 2 / 3;


        results.push({
            name:
                daughters === 1
                    ? "Qiz"
                    : "Qizlar",

            count:
                daughters,

            share,

            source:
                "Niso 4:11"
        });

    }


    /*
     * =========================
     * MATERNAL SIBLINGS
     * =========================
     */

    if (
        maternalSiblings > 0 &&
        !descendants &&
        !father
    ) {

        const share =
            maternalSiblings === 1
                ? 1 / 6
                : 1 / 3;


        results.push({
            name:
                maternalSiblings === 1
                    ? "Ona bir aka-uka"
                    : "Ona bir aka-ukalar",

            count:
                maternalSiblings,

            share,

            source:
                "Niso 4:12"
        });

    }


    /*
     * =========================
     * FULL SISTERS
     * =========================
     */

    if (
        fullSisters > 0 &&
        fullBrothers === 0 &&
        !descendants &&
        !father
    ) {

        const share =
            fullSisters === 1
                ? 1 / 2
                : 2 / 3;


        results.push({
            name:
                fullSisters === 1
                    ? "Tug‘ishgan opa-singil"
                    : "Tug‘ishgan opa-singillar",

            count:
                fullSisters,

            share,

            source:
                "Niso 4:176"
        });

    }


    /*
     * =========================
     * FIXED SHARES
     * =========================
     */

    let fixedTotal =
        results.reduce(
            (total, result) =>
                total + result.share,
            0
        );


    /*
     * 'AWL
     *
     * If fixed shares exceed
     * the whole estate, normalize.
     */

    if (fixedTotal > 1) {

        warnings.push(
            "Ushbu holatda 'awl qoidasi yuzaga kelishi mumkin."
        );


        results.forEach(
            (result) => {

                result.share =
                    result.share /
                    fixedTotal;

            }
        );


        fixedTotal = 1;

    }


    /*
     * =========================
     * RESIDUE
     * =========================
     */

    let residue =
        Math.max(
            0,
            1 - fixedTotal
        );


    /*
     * SONS + DAUGHTERS
     *
     * Male receives 2 units,
     * female receives 1 unit.
     */

    if (sons > 0) {

        const units =
            sons * 2 +
            daughters;


        const sonShare =
            residue *
            (2 / units);


        const daughterShare =
            residue *
            (1 / units);


        results.push({
            name: "O‘g‘illar",

            count: sons,

            share: sonShare,

            source:
                "Niso 4:11"
        });


        if (daughters > 0) {

            results.push({
                name: "Qizlar",

                count:
                    daughters,

                share:
                    daughterShare,

                source:
                    "Niso 4:11"
            });

        }


        residue = 0;

    }


    /*
     * FATHER AS RESIDUARY
     */

    else if (
        father &&
        residue > 0
    ) {

        results.push({
            name:
                "Ota — qoldiq",

            count: 1,

            share:
                residue,

            source:
                "Niso 4:11"
        });


        residue = 0;

    }


    /*
     * =========================
     * ADVANCED CASE WARNING
     * =========================
     */

    if (
        grandfather ||
        grandmother > 0 ||
        fullBrothers > 0 ||
        fullSisters > 0
    ) {

        warnings.push(
            "Bobolar, buvilar va aka-ukalar ishtirokidagi ayrim holatlar mazhabga xos tafsilotlarni talab qiladi. Natijani mutaxassis bilan tekshiring."
        );

    }


    if (
        enteredWasiyyah >
        wasiyyah
    ) {

        warnings.push(
            "Kiritilgan vasiyat miqdori ushbu soddalashtirilgan hisobda 1/3 bilan cheklangan."
        );

    }


    renderResult({
        gross,
        funeral,
        debts,
        wasiyyah,
        netEstate,
        results,
        warnings
    });

}


/* =========================
   RENDER
========================= */

function renderResult(data) {

    const currency =
        $("currency").value;


    const madhab =
        $("madhab")
            .selectedOptions[0]
            .textContent;


    let html = `

        <div class="result-header">

            <div>
                <h3>
                    Natija
                </h3>

                <small>
                    ${madhab} mazhabi
                </small>
            </div>

        </div>


        <div class="net-estate">

            <small>
                Taqsimlanadigan sof meros
            </small>

            <strong>
                ${formatMoney(data.netEstate)}
                ${currency}
            </strong>

        </div>

    `;


    if (data.funeral > 0) {

        html += `
            <div class="result-notes">
                <p>
                    Dafn xarajatlari:
                    − ${formatMoney(data.funeral)}
                    ${currency}
                </p>

                <p>
                    Qarzdorlik:
                    − ${formatMoney(data.debts)}
                    ${currency}
                </p>

                <p>
                    Vasiyat:
                    − ${formatMoney(data.wasiyyah)}
                    ${currency}
                </p>
            </div>
        `;

    }


    data.warnings.forEach(
        (warning) => {

            html += `
                <div class="warning">
                    ⚠ ${warning}
                </div>
            `;

        }
    );


    data.results.forEach(
        (result) => {

            const percent =
                result.share * 100;


            const amount =
                data.netEstate *
                result.share;


            html += `

                <div class="share-row">

                    <div class="share-header">

                        <span class="share-name">

                            ${result.name}

                            ${
                                result.count > 1
                                    ? ` × ${result.count}`
                                    : ""
                            }

                        </span>

                        <span class="share-percent">
                            ${percent.toFixed(2)}%
                        </span>

                    </div>


                    <div class="progress">

                        <span
                            style="
                                width:
                                ${Math.min(
                                    100,
                                    percent
                                )}%
                            "
                        ></span>

                    </div>


                    <div class="share-footer">

                        <span>
                            ${getFraction(
                                result.share
                            )}

                            ·

                            ${result.source}
                        </span>

                        <strong>
                            ${formatMoney(amount)}
                            ${currency}
                        </strong>

                    </div>

                </div>

            `;

        }
    );


    html += `

        <div class="result-notes">

            <p>
                ✓ Hisoblash Qur’onning
                Niso surasi 11, 12 va 176-oyatlariga
                asoslangan umumiy modeldir.
            </p>

            <p>
                ⚠ Bu natija fatvo yoki yuridik
                meros taqsimoti hisoblanmaydi.
            </p>

        </div>

    `;


    $("results").innerHTML =
        html;

}


/* =========================
   FRACTION
========================= */

function getFraction(value) {

    const fractions = [

        [1 / 2, "1/2"],

        [1 / 4, "1/4"],

        [1 / 8, "1/8"],

        [1 / 3, "1/3"],

        [2 / 3, "2/3"],

        [1 / 6, "1/6"]

    ];


    const match =
        fractions.find(
            ([number]) =>
                Math.abs(
                    number - value
                ) < 0.00001
        );


    if (match) {
        return match[1];
    }


    return `${(
        value * 100
    ).toFixed(2)}%`;
}