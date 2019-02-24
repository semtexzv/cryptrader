$("#assignments tbody tr").each(function () {
    let period = $(this).find("#period");
    let strat = $(this).find('#strategy_id');
    let form = $(this).find('#save');

    period.prop('selectedIndex', period.data('idx'));
    strat.prop('selectedIndex', strat.data('idx'));


    period.change(function () {
        if (period.prop('selectedIndex') == 0) {
            period.prop('selectedIndex', 0);
            strat.prop('selectedIndex', 0);
        }
        let formElem = $(form).children('input[name=period]');
        let elem = $('option:selected', period);
        let val = elem.val();

        formElem.val(val)
    });

    strat.change(function () {
        if (strat.prop('selectedIndex') == 0) {
            period.prop('selectedIndex', 0);
            strat.prop('selectedIndex', 0);
        }
        let formElem = $(form).children('input[name=strategy_id]');

        let elem = $('option:selected', strat);
        let val = elem.data('id');

        formElem.val(val)
    });
});