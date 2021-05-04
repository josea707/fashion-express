const getProvinceTax = (province) => {
    switch(province)
    {
        case 'AB':
        case 'NT':
        case 'NU':
        case 'YT':
            return 5;
        case 'BC':
        case 'MB':
            return 12;
        case 'NB':
        case 'NL':
        case 'NS':
        case 'PE':
            return 15;
        case 'ON':
            return 13;
        case 'QC':
            return 14.975;
        case 'SK':
            return 11;
        default:
            return 0;
        
    }
}

export default getProvinceTax;