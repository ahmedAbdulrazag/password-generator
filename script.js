
const model = {
    generatedPassword: '',
    init() { 
        // create characters' arrays that'll be used to generate a strong password 
        const symbols = ['!', "-", '_', '@', '#', '$', '$', '%', '^', '&', ';', ':']
        const numbers = Array.from(Array(20)).map((_, i) => i)
        const lowerCaseLettersCharsCode = Array.from(Array(26)).map((_, i) => i + 97)
        const lowerCaseLetters = lowerCaseLettersCharsCode.map((charCode) => String.fromCharCode(charCode))
        const upperCaseLettes = lowerCaseLetters.map((letter) => letter.toUpperCase())

        return {
            symbols,
            numbers,
            lowerCaseLetters,
            upperCaseLettes
        }
    }
}

const controller = {
    init() {
        view.init() 
    },

    getGeneratedPasswordValue() {
        return model.generatedPassword
    },

    resetForm(e) {
        e.target.reset()
    },

    generatePassword(options) {
        // Grap user prefrences from the submited form 
        const { charsAmount, hasLower, hasUpper, hasNumbers, hasSymbols } = options

        // Grap our password chars arrays from the model
        const { symbols, numbers, lowerCaseLetters, upperCaseLettes } = model.init()

        // This variable will hold our generatedPassword 
        let password = ''
        
        // An array of all the chars that'll be included in the password 
        const passwordCharacters = [
            ...(hasLower ? lowerCaseLetters : []),
            ...(hasUpper ? upperCaseLettes : []),
            ...(hasNumbers ? numbers : []),
            ...(hasSymbols ? symbols : []),
        ]
        
        if(passwordCharacters.length === 0) {
            alert('You must at least check one of the checkboxes!')
            return this.updateGeneratedPasswordAndRender('')
        }
        
        // get a random char (charsAmount) times 
        for(let i = 0; i <= charsAmount; i++) {
            const randomIndex = Math.floor(Math.random() * passwordCharacters.length)
            password += passwordCharacters[randomIndex]
        }

        // Update view; display password value on the screen 
        this.updateGeneratedPasswordAndRender(password)
    },

    updateGeneratedPasswordAndRender(value) {
        model.generatedPassword = value
        view.render()
    },

    copyInnerText(element) {
        // Copy text to clipboard 
        navigator.clipboard.writeText(element.innerText)
        
        // Update view; after we copy the text we clear the screen
        this.updateGeneratedPasswordAndRender('')
    },

}

const view = {
    init() {
        this.resultsElement = document.getElementById('results')
        this.formElement = document.getElementById('form')
        this.copyTextButton = document.getElementById('copy-button')


        this.formElement.addEventListener('submit', (e) => {
            // Prevent the browser from refreshing 
            e.preventDefault()

            // Grap form elements 
            const charsAmountElement = document.getElementById('charsAmount')
            const lowerCaseLettersElement = document.getElementById('lowerCaseLetters')
            const upperCaseLettersElement = document.getElementById('upperCaseLetters')
            const numbersElement = document.getElementById('numbers')
            const symbolsElement = document.getElementById('symbols')

            // Pass user input as an object to generate a password
            controller.generatePassword(
                 { 
                    charsAmount: charsAmountElement.value,
                    hasLower: lowerCaseLettersElement.checked,
                    hasUpper: upperCaseLettersElement.checked,
                    hasNumbers: numbersElement.checked,
                    hasSymbols: symbolsElement.checked,
                 }
            )

            // Reset the form to the default value
            controller.resetForm(e)
        })

        // Fires up when copyTextButton is clicked 
        this.copyTextButton.addEventListener('click', () => {
            // Copy text to clipborad 
            controller.copyInnerText(this.resultsElement)
        })

    },

    render() {
        // Display our password value on the screen
        this.resultsElement.innerText = controller.getGeneratedPasswordValue()
    }
}


// Let's goooo 
controller.init()