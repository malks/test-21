import joi from 'joi'

const createValidator =  joi.object({
    id:                     joi.number(),
    email:                  joi.string().email(),
    name:                   joi.string().min(3).pattern(/^[A-Za-z\W]+$/),
    cpf:                    joi.string().pattern(/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/),
    account_bank:           joi.string().alphanum().required(),
    account_agency:         joi.string().max(4).pattern(/^(?:^0*)[1-9][0-9]{0,3}$/).required(),
    account_agency_digit:   joi.alternatives().
                                conditional( 
                                    joi.ref('account_bank'), 
                                    { 
                                        is: '001', 
                                        then:       joi.string().pattern(/^[xX0-9]{0,1}$/),
                                        otherwise:  joi.string().pattern(/^[0-9]{0,1}$/),
                                    },
                                ),
    account_type:           joi.alternatives().
                                conditional( 
                                    joi.ref('account_bank'), 
                                    { 
                                        is: '001', 
                                        then:       joi.string().pattern(/^(savings|checking|easy)$/).required(),
                                        otherwise:  joi.string().pattern(/^(savings|checking)$/).required(),
                                    },
                                ),
    account_number:         joi.alternatives().
                                conditional( 
                                    joi.ref('account_bank'), 
                                    { 
                                        is: '001', 
                                        then:       joi.string().max(8).pattern(/^(?:^0*)[1-9][0-9]{0,7}$/).required(),
                                        otherwise:  joi.string().max(11).pattern(/^(?:^0*)[1-9][0-9]{0,10}$/).required(),
                                    },
                                ),
    account_number_digit:   joi.alternatives().
                                conditional( 
                                    joi.ref('account_bank'), 
                                    { 
                                        is: '001', 
                                        then:       joi.string().pattern(/^[xX0-9]{0,1}$/).required(),
                                        otherwise:  joi.string().pattern(/^[0-9]{0,1}$/).required(),
                                    },
                                ),
})

export default createValidator;