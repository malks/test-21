import joi from 'joi'

const updateValidator =  joi.object({
    id:                     joi.number(),
    email:                  joi.string(),
    name:                   joi.string().min(3).pattern(/^[A-Za-z\W]+$/),
    cpf:                    joi.string().pattern(/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/),
    account_bank:           joi.string().alphanum(),
    account_agency:         joi.string().max(4).pattern(/^(?:^0*)[1-9][0-9]{0,3}$/),
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
                                        then:       joi.string().pattern(/^(CONTA_POUPANCA|CONTA_CORRENTE|CONTA_FACIL)$/),
                                        otherwise:  joi.string().pattern(/^(CONTA_POUPANCA|CONTA_CORRENTE)$/),
                                    },
                                ),
    account_number:         joi.alternatives().
                                conditional( 
                                    joi.ref('account_bank'), 
                                    { 
                                        is: '001', 
                                        then:       joi.string().max(8).pattern(/^(?:^0*)[1-9][0-9]{0,7}$/),
                                        otherwise:  joi.string().max(11).pattern(/^(?:^0*)[1-9][0-9]{0,10}$/),
                                    },
                                ),
    account_number_digit:   joi.alternatives().
                                conditional( 
                                    joi.ref('account_bank'), 
                                    { 
                                        is: '001', 
                                        then:       joi.string().pattern(/^[xX0-9]{0,1}$/),
                                        otherwise:  joi.string().pattern(/^[0-9]{0,1}$/),
                                    },
                                ),
})

export default updateValidator;