export function propsAsString(obj) {
    /*
    @description:
        Converts the combined values of a object to a string
    @args:
        obj (object): The values of this object will be combined converted to a string
            e.g. {"time":"earlyMorning","sleep":"8:15"} ==> "earlyMorning; 8:15"
    @return:
        strValues (str): e.g. {"time":"earlyMorning","sleep":"8:15"} ==> "earlyMorning; 8:15"
    */
    //1.Step: Convert the values to an array
    const arrayValues = Object.keys(obj).map(function(k) {return obj[k]})
    //2.Step: Filter out every empty array
    const arrayValuesContain = arrayValues.filter(Boolean)
    //3.Step: Combine the values to a string
    const strValues = arrayValuesContain.join("; ")
    return strValues
}
