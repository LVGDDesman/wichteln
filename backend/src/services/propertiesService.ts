import PropertiesReader from "properties-reader";


class Properties {
    static PropertyFilePath = "../../wichteln.properties";
    static prop = PropertiesReader(this.PropertyFilePath);;
    
    static get (property: string): any {
        return this.prop.get(property);
    }

}
export default Properties