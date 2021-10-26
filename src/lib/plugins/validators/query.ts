import joi from 'joi'

const queryFavoredValidator = joi.object({
    take: joi.number().integer(),
    skip: joi.number().integer(),
    orderDirection: joi.string().alphanum().min(3).max(4),
    searchString:   joi.string().alphanum(),
})

export const queryBankValidator = joi.object({
    searchString:   joi.string().alphanum(),
})

export default queryFavoredValidator;