import { eachDayOfInterval, startOfWeek,format } from 'date-fns'
import { chunk, groupBy } from 'lodash';

export const mealNameCreate = (_data: any) => {
    const partner =  _data.partner_sachet?.title || 'Partner'
    const main =  _data.main_sachet?.title || 'Main'
    const cond =  _data.condiment_sachet?.title || 'Condiment'
    return `${main} with ${partner} & ${cond}`
};

export const mealImageLink = (_data: any, type: string) => {
    switch (type) {
        case 'side':
            return _data.side_sachet?.images[0]?.image || '' 
        case 'combination':
            if(_data?.combination?.combination_maps[0]){
                return _data?.combination?.combination_maps[0].image.image || ''
            }
            return _data?.combination?.images[0]?.image || '' 
        case 'condiment':
            return _data.condiment_sachet?.images[0]?.image || '' 
        case 'partner':
            return _data.partner_sachet?.images[0]?.image || '' 
        default:
            return ''
    }
};

export const selectedTypes = (type: string) => {
    switch (type) {
        case 'side':
            return 'side_sachet_id' 
        case 'main':
            return 'main_sachet_id' 
        case 'condiment':
            return 'condiment_sachet_id'  
        case 'partner':
            return 'partner_sachet_id'
        default:
            return ''
    }
};

export const updateSelectedItemTypes = (type: string) => {
    switch (type) {
        case 'side':
            return 'side_sachet' 
        case 'main':
            return 'main_sachet' 
        case 'condiment':
            return 'condiment_sachet'  
        case 'partner':
            return 'partner_sachet'
        default:
            return ''
    }
};


export const mealOrderSelection = (_startDate: any, endDate: any, menu: any ) => { 
    const activeWeek = menu  && menu.filter((item: any) => item.current_week == true);
    const weekstart = startOfWeek(new Date(), {weekStartsOn: 6})
    // const weekend = endOfWeek(startDate, {weekStartsOn: 6})

    const activeWeekNo = activeWeek && activeWeek[0] && activeWeek[0].week  
    
    var resultto = eachDayOfInterval({
        start: weekstart,
        end: endDate
    })


    const grou = chunk(resultto, 7);

    const week = ['1', '2', '3', '4']
    const weer =  rotationWeek(week, activeWeekNo - 1)

    let month_weekdays: any = [];
    
        grou.forEach((entry, i) => {
        // console.log(entry); // 1, "string", false
        month_weekdays.push({
            'week': weer[i] ,
            'item': entry
            
        })
    })

    let month_days: any = [];
    month_weekdays && month_weekdays.forEach((data: any) => {
        const gg =  menu.filter((item: any) => item.week == data.week);
    
        data.item.forEach((date: any) => {
            const currentday = format(date, 'iiii').toLowerCase();
                month_days.push({
                'date': date ,
                'item': gg[0] && gg[0].days && gg[0].days[currentday]
            })
        })
    })

    return month_days
};

export const currentOderItem = (startDate: any, endDate: any, menu: any ) => { 
    if(menu) {
        var resultProductData = menu.filter((a: any) => {
            var date = a.date;
            return (date >= startDate && date <= endDate);
        });
        return resultProductData
    }
    return {}
}

export const rotationWeek = (xArray: any, numberOfLeftRotations: any) => {
    var newArray = [];

    for (var i = 0; i < xArray.length + 10; i++) {
        var newIndex = (i + numberOfLeftRotations) % xArray.length;
        newArray[i] = xArray[newIndex];
    }    
    return newArray
};

export const itemMap = (_item: any) => {
    // const dd = ['BREAKFAST', 'AM SNACK', 'LUNCH', 'PM SNACK', 'DINNER'];

    
    // var newArray = [];
    // // if(!item) {
    // //     newArray.push({
    // //         'itemname': date ,
    // //         'item': gg[0] && gg[0].days && gg[0].days[currentday]
    // //     })
    // // }
    // item.forEach((_date: any, i: any) => {
    //     console.log('item looped')
    // })
    // console.log('itemMap', item)
    // console.log('itemMap[newArray]', item)
}

export const dateGroupArry = (startDate: any, endDate: any) => {
  var resultto = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const remap = resultto && resultto.map(item => ({'date': format(item, 'dd LLL yyyy'), 'day': format(item, 'iiii').toLowerCase() }))
  const groupDate = remap && groupBy(remap, 'day');
  
  return groupDate
}