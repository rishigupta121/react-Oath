
export function filterCategoriesOnTime(categories) {
    var currentTime = new Date();
    var filteredCategories = [];
    for (var categoryId in categories) {
        var category = categories[categoryId];
        var startTime = new Date();
        startTime.setHours(category.startTime.split(':')[0]);
        startTime.setMinutes(category.startTime.split(':')[1]);
        var endTime = new Date();
        endTime.setHours(category.endTime.split(':')[0]);
        endTime.setMinutes(category.endTime.split(':')[1]);
        if (startTime < currentTime && currentTime < endTime) {
            filteredCategories.push(category);
        }
    }
    return filteredCategories;
}