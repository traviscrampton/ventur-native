export default class DropDownHolder {
  static dropDown;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }
  static getDropDown() {
    return this.dropDown;
  }

  static alert(type: AlertType, title: string, message: string) {
    this.dropDown.alertWithType(type, title, message);
  }
}
