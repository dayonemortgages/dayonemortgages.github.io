(function () {
    const form = document.querySelector("[data-calculator-form]");
    if (!form) return;

    const result = document.querySelector("[data-calculator-result]");
    const amountOutput = document.querySelector("[data-repayment-amount]");
    const captionOutput = document.querySelector("[data-repayment-caption]");
    const principalOutput = document.querySelector("[data-output-principal]");
    const rateOutput = document.querySelector("[data-output-rate]");
    const totalInterestOutput = document.querySelector("[data-total-interest]");
    const totalInterestLargeOutput = document.querySelector("[data-total-interest-large]");
    const totalInterestCaption = document.querySelector("[data-total-interest-caption]");
    const totalPaidOutput = document.querySelector("[data-total-paid]");
    const statusOutput = document.querySelector("[data-calculator-status]");
    const chartRoot = document.querySelector("[data-repayment-chart]");
    const tableBody = document.querySelector("[data-amortisation-table]");
    const ranges = Array.from(document.querySelectorAll("[data-range-for]"));

    const frequencyMap = {
        weekly: { label: "Weekly", unit: "week", periods: 52 },
        fortnightly: { label: "Fortnightly", unit: "fortnight", periods: 26 },
        monthly: { label: "Monthly", unit: "month", periods: 12 }
    };

    const repaymentTypeMap = {
        principalInterest: "Principal & Interest",
        interestOnly: "Interest Only"
    };

    const rules = {
        loanAmount: {
            label: "Loan amount",
            min: 1000,
            max: 10000000,
            message: "Enter a loan amount between $1,000 and $10,000,000."
        },
        interestRate: {
            label: "Interest rate",
            min: 0,
            max: 20,
            message: "Enter an interest rate between 0% and 20%."
        },
        loanTerm: {
            label: "Loan term",
            min: 1,
            max: 40,
            integer: true,
            message: "Enter a whole number of years between 1 and 40."
        },
        repaymentFrequency: {
            label: "Repayment frequency",
            message: "Choose a repayment frequency."
        },
        repaymentType: {
            label: "Repayment type",
            message: "Choose a repayment type."
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const validation = validateForm(true);
        validation.valid ? updateCalculator(validation.values) : showValidationSummary(validation.errors);
    });

    form.addEventListener("input", (event) => {
        const rangeTarget = event.target.getAttribute("data-range-for");
        if (rangeTarget) {
            form.elements[rangeTarget].value = event.target.value;
        }

        syncRanges();
        const validation = validateForm(true);
        validation.valid ? updateCalculator(validation.values) : showValidationSummary(validation.errors);
    });

    form.addEventListener("change", () => {
        syncRanges();
        const validation = validateForm(true);
        validation.valid ? updateCalculator(validation.values) : showValidationSummary(validation.errors);
    });

    document.querySelectorAll("[data-calc-tab]").forEach((tab) => {
        tab.addEventListener("click", () => setActiveTab(tab.getAttribute("data-calc-tab")));
    });

    syncRanges();
    const initialValidation = validateForm(false);
    if (initialValidation.valid) {
        updateCalculator(initialValidation.values);
    }

    function validateForm(showErrors) {
        const errors = [];
        const values = {};

        Object.keys(rules).forEach((name) => {
            const fieldResult = validateField(name, showErrors);
            if (fieldResult.error) errors.push(fieldResult.error);
            values[name] = fieldResult.value;
        });

        return {
            valid: errors.length === 0,
            errors,
            values
        };
    }

    function validateField(name, showError) {
        const rule = rules[name];
        const errorNode = document.querySelector(`[data-field-error="${name}"]`);
        const fields = Array.from(form.querySelectorAll(`[name="${name}"]`));
        let value = getFieldValue(name);
        let error = "";

        if (!rule) return { value: null, error: "" };

        if (value === "") {
            error = `${rule.label} is required.`;
        } else if (name === "repaymentFrequency") {
            if (!frequencyMap[value]) error = rule.message;
        } else if (name === "repaymentType") {
            if (!repaymentTypeMap[value]) error = rule.message;
        } else {
            value = Number(value);
            if (!Number.isFinite(value)) {
                error = `${rule.label} must be a valid number.`;
            } else if (rule.integer && !Number.isInteger(value)) {
                error = rule.message;
            } else if (value < rule.min || value > rule.max) {
                error = rule.message;
            }
        }

        fields.forEach((field) => field.setAttribute("aria-invalid", String(Boolean(error))));

        if (errorNode) {
            errorNode.textContent = showError ? error : "";
            errorNode.hidden = !showError || !error;
        }

        return { value, error };
    }

    function getFieldValue(name) {
        const field = form.elements[name];
        if (!field) return "";
        if (typeof RadioNodeList !== "undefined" && field instanceof RadioNodeList) return field.value || "";
        if (field.length && field[0]?.type === "radio") {
            const checked = Array.from(field).find((item) => item.checked);
            return checked ? checked.value : "";
        }
        return field.value.trim();
    }

    function updateCalculator(values) {
        const loanAmount = values.loanAmount;
        const interestRate = values.interestRate;
        const loanTerm = values.loanTerm;
        const frequency = frequencyMap[values.repaymentFrequency];
        const isInterestOnly = values.repaymentType === "interestOnly";
        const numberOfPayments = loanTerm * frequency.periods;
        const periodicRate = interestRate / 100 / frequency.periods;
        const repayment = calculateRepayment(loanAmount, periodicRate, numberOfPayments, isInterestOnly);

        if (!Number.isFinite(repayment)) {
            showMessage("The repayment could not be calculated from those values.");
            return;
        }

        const periodSchedule = buildPeriodSchedule({
            loanAmount,
            periodicRate,
            repayment,
            numberOfPayments,
            isInterestOnly
        });

        const totalInterest = periodSchedule.reduce((sum, period) => sum + period.interest, 0);
        const finalBalance = periodSchedule.length ? periodSchedule[periodSchedule.length - 1].balance : loanAmount;
        const totalPaid = loanAmount + totalInterest;

        result.hidden = false;
        amountOutput.textContent = formatCurrency(repayment);
        captionOutput.textContent = `per ${frequency.unit} for ${loanTerm} ${loanTerm === 1 ? "year" : "years"}`;
        principalOutput.textContent = formatCurrency(loanAmount);
        rateOutput.textContent = `${formatNumber(interestRate, 2)}%`;
        totalInterestOutput.textContent = formatCurrency(totalInterest);
        totalInterestLargeOutput.textContent = formatCurrency(totalInterest);
        totalInterestCaption.textContent = `over ${loanTerm} ${loanTerm === 1 ? "year" : "years"}`;
        totalPaidOutput.textContent = isInterestOnly ? `${formatCurrency(totalPaid)} incl. ${formatCurrency(finalBalance)} balance` : formatCurrency(totalPaid);

        renderChart(periodSchedule, {
            periodsPerYear: frequency.periods,
            loanTerm,
            totalInterest
        });
        renderTable(periodSchedule);

        if (statusOutput) statusOutput.textContent = "";
    }

    function calculateRepayment(loanAmount, periodicRate, numberOfPayments, isInterestOnly) {
        if (isInterestOnly) return loanAmount * periodicRate;
        if (periodicRate === 0) return loanAmount / numberOfPayments;

        const compound = Math.pow(1 + periodicRate, numberOfPayments);
        return loanAmount * ((periodicRate * compound) / (compound - 1));
    }

    function buildPeriodSchedule({ loanAmount, periodicRate, repayment, numberOfPayments, isInterestOnly }) {
        const schedule = [{
            period: 0,
            payment: 0,
            principal: 0,
            interest: 0,
            balance: loanAmount,
            interestPaidToDate: 0
        }];
        let balance = loanAmount;
        let interestPaidToDate = 0;

        for (let period = 1; period <= numberOfPayments; period += 1) {
            const interest = balance * periodicRate;
            const principal = isInterestOnly ? 0 : Math.min(Math.max(repayment - interest, 0), balance);
            const payment = principal + interest;
            interestPaidToDate += interest;
            balance = Math.max(balance - principal, 0);

            schedule.push({
                period,
                payment,
                principal,
                interest,
                balance,
                interestPaidToDate
            });
        }

        return schedule;
    }

    function renderChart(schedule, { periodsPerYear, loanTerm, totalInterest }) {
        if (!chartRoot) return;

        const width = 860;
        const height = 430;
        const margin = { top: 24, right: 30, bottom: 70, left: 110 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        const points = buildChartPoints(schedule, periodsPerYear, loanTerm, totalInterest);
        const maxAmount = niceCeil(Math.max(...points.map((point) => point.totalRemaining), 1));
        const yTicks = buildTicks(maxAmount, 4);
        const xTicks = buildTermTicks(loanTerm);

        const x = (year) => margin.left + (year / loanTerm) * chartWidth;
        const y = (amount) => margin.top + chartHeight - (amount / maxAmount) * chartHeight;
        const principalLine = points.map((point) => `${x(point.year)},${y(point.principalRemaining)}`).join(" ");
        const totalLine = points.map((point) => `${x(point.year)},${y(point.totalRemaining)}`).join(" ");
        const principalArea = [
            `${x(0)},${y(0)}`,
            principalLine,
            `${x(loanTerm)},${y(0)}`
        ].join(" ");
        const interestArea = [
            principalLine,
            ...points.slice().reverse().map((point) => `${x(point.year)},${y(point.totalRemaining)}`)
        ].join(" ");

        chartRoot.innerHTML = `
            <svg class="repayment-area-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Repayment chart showing principal and interest reducing over the loan term">
                <g class="chart-grid">
                    ${yTicks.map((tick) => `
                        <line x1="${margin.left}" y1="${y(tick)}" x2="${width - margin.right}" y2="${y(tick)}"></line>
                        <text x="${margin.left - 18}" y="${y(tick) + 5}" text-anchor="end">${formatAxisCurrency(tick)}</text>
                    `).join("")}
                </g>
                <polygon class="chart-area-principal" points="${principalArea}"></polygon>
                <polygon class="chart-area-interest" points="${interestArea}"></polygon>
                <polyline class="chart-line-principal" points="${principalLine}"></polyline>
                <polyline class="chart-line-interest" points="${totalLine}"></polyline>
                <g class="chart-points">
                    ${points.map((point) => `<circle cx="${x(point.year)}" cy="${y(point.totalRemaining)}" r="4"></circle>`).join("")}
                </g>
                <g class="chart-axis">
                    <line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}"></line>
                    ${xTicks.map((tick) => `
                        <line x1="${x(tick)}" y1="${height - margin.bottom}" x2="${x(tick)}" y2="${height - margin.bottom + 10}"></line>
                        <text x="${x(tick)}" y="${height - margin.bottom + 34}" text-anchor="middle">${tick}</text>
                    `).join("")}
                    <text class="chart-axis-label" x="${margin.left + chartWidth / 2}" y="${height - 14}" text-anchor="middle">Term (Years)</text>
                    <text class="chart-axis-label" x="28" y="${margin.top + chartHeight / 2}" text-anchor="middle" transform="rotate(-90 28 ${margin.top + chartHeight / 2})">Amount owing ($)</text>
                </g>
            </svg>
        `;
    }

    function renderTable(schedule) {
        if (!tableBody) return;

        tableBody.innerHTML = schedule.map((period) => `
            <tr>
                <td>${period.period}</td>
                <td>${period.payment ? `-${formatCurrencyPrecise(period.payment)}` : formatCurrencyPrecise(0)}</td>
                <td>${formatCurrencyPrecise(period.interest)}</td>
                <td>${formatCurrencyPrecise(period.balance)}</td>
            </tr>
        `).join("");
    }

    function buildChartPoints(schedule, periodsPerYear, loanTerm, totalInterest) {
        const points = [];
        const maxPeriod = schedule.length - 1;
        const step = loanTerm > 12 ? Math.ceil(loanTerm / 30) : 1;

        for (let year = 0; year <= loanTerm; year += step) {
            const periodIndex = Math.min(Math.round(year * periodsPerYear), maxPeriod);
            const period = schedule[periodIndex];
            const interestRemaining = Math.max(totalInterest - period.interestPaidToDate, 0);

            points.push({
                year,
                principalRemaining: period.balance,
                totalRemaining: period.balance + interestRemaining
            });
        }

        if (points[points.length - 1]?.year !== loanTerm) {
            const final = schedule[maxPeriod];
            points.push({
                year: loanTerm,
                principalRemaining: final.balance,
                totalRemaining: final.balance
            });
        }

        return points;
    }

    function buildTermTicks(loanTerm) {
        const step = loanTerm <= 10 ? 1 : loanTerm <= 20 ? 5 : 10;
        const ticks = [];
        for (let value = 0; value <= loanTerm; value += step) ticks.push(value);
        if (ticks[ticks.length - 1] !== loanTerm) ticks.push(loanTerm);
        return ticks;
    }

    function buildTicks(maxAmount, count) {
        return Array.from({ length: count + 1 }, (_, index) => (maxAmount / count) * index);
    }

    function niceCeil(value) {
        const magnitude = Math.pow(10, Math.max(Math.floor(Math.log10(value)) - 1, 0));
        return Math.ceil(value / magnitude) * magnitude;
    }

    function syncRanges() {
        ranges.forEach((range) => {
            const target = form.elements[range.getAttribute("data-range-for")];
            if (!target) return;

            const value = Number(target.value);
            const min = Number(range.min);
            const max = Number(range.max);

            if (Number.isFinite(value)) {
                range.value = String(Math.min(Math.max(value, min), max));
            }

            const progress = ((Number(range.value) - min) / (max - min)) * 100;
            range.style.setProperty("--range-progress", `${Math.min(Math.max(progress, 0), 100)}%`);
        });
    }

    function setActiveTab(name) {
        document.querySelectorAll("[data-calc-tab]").forEach((tab) => {
            const isActive = tab.getAttribute("data-calc-tab") === name;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });

        document.querySelectorAll("[data-calc-panel]").forEach((panel) => {
            const isActive = panel.getAttribute("data-calc-panel") === name;
            panel.classList.toggle("is-active", isActive);
            panel.hidden = !isActive;
        });
    }

    function showValidationSummary(errors) {
        showMessage("Update the highlighted fields to calculate repayments.");
        if (statusOutput) {
            statusOutput.textContent = errors[0] || "Update the highlighted fields to calculate repayments.";
        }
    }

    function showMessage(message) {
        amountOutput.textContent = "-";
        captionOutput.textContent = message;
        principalOutput.textContent = "-";
        rateOutput.textContent = "-";
        totalInterestOutput.textContent = "-";
        totalInterestLargeOutput.textContent = "-";
        totalInterestCaption.textContent = "";
        totalPaidOutput.textContent = "-";
        if (chartRoot) chartRoot.innerHTML = "";
        if (tableBody) tableBody.innerHTML = "";
    }

    function formatCurrency(value) {
        return value.toLocaleString("en-NZ", {
            style: "currency",
            currency: "NZD",
            maximumFractionDigits: 0
        });
    }

    function formatCurrencyPrecise(value) {
        return value.toLocaleString("en-NZ", {
            style: "currency",
            currency: "NZD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatAxisCurrency(value) {
        if (value >= 1000000) return `$${formatNumber(value / 1000000, value % 1000000 ? 1 : 0)}M`;
        if (value >= 1000) return `$${Math.round(value / 1000)}k`;
        return formatCurrency(value);
    }

    function formatNumber(value, digits) {
        return value.toLocaleString("en-NZ", {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        });
    }
})();
