global.dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

global.epochSecToDateString = (epochS) => {
    const dateOptions = global.dateOptions;
    const dateCreatedMs = epochS*1000;
    const date = new Date(dateCreatedMs);
    const formattedDate = date.toLocaleDateString("sk-SK", dateOptions);
    return formattedDate;
};

module.exports = global;