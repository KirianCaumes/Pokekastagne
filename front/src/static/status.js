/**
 * Status
 * @readonly
 * @enum {string}
 */
export const Status = {
    /** First launch */
    IDLE: "idle",
    /** Loading */
    PENDING: "pending",
    /** Loading resolved successfully */
    RESOLVED: "resolved",
    /** Loading rejected */
    REJECTED: "rejected",
}