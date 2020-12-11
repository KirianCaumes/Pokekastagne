/**
 * Invalid Entity Error, thrown when fields are missing or wrong
 * @template E 
 */
export class InvalidEntityError extends Error {
    /**
     * 
     * @param {object} data 
     * @param {object} data.errorType Class to use for error
     * @param {object} data.content Content of the errors
     * @param {string} data.content.description 
     * @param {object} data.content.validationResults 
     */
    constructor({ content, errorType }) {
        super(content.description)
        this.name = this.constructor.name

        /** 
         * Object containing all the errors
         * @type {E} 
         */
        this.errorField = new (errorType)()

        //Init errors from API into the object
        for (const validationResult of content.validationResults) {
            for (const memberName of validationResult.memberNames) {
                if (this.errorField[memberName]) {
                    this.errorField[memberName] += `, ${validationResult.errorMessage}`
                } else {
                    this.errorField[memberName] = validationResult.errorMessage
                }
            }
        }
    }
}