import {WorkPackageResource} from './../../api/api-v3/hal-resources/work-package-resource.service';
import {injectorBridge} from '../../angular/angular-injector-bridge.functions';
import {UiStateLinkBuilder} from './ui-state-link-builder';

export const detailsLinkTdClass = 'wp-table--details-column';
export const detailsLinkClassName = 'wp-table--details-link';

export class DetailsLinkBuilder {
  // Injections
  public I18n:op.I18n;

  public text:any;
  private uiStatebuilder:UiStateLinkBuilder;

  constructor() {
    injectorBridge(this);
    this.text = {
      button: this.I18n.t('js.button_open_details')
    };
    this.uiStatebuilder = new UiStateLinkBuilder();
  }

  public build(workPackage:WorkPackageResource):HTMLElement {
    // Append details button
    let td = document.createElement('td');
    td.classList.add(detailsLinkTdClass, 'hide-when-print', '-short');

    let detailsLink = this.uiStatebuilder.linkToDetails(
      workPackage.id,
      this.text.button,
      ''
    );

    detailsLink.classList.add(detailsLinkClassName, 'hidden-for-sighted');
    let icon = document.createElement('i');
    icon.classList.add('icon', 'icon-info2');
    detailsLink.appendChild(icon);

    td.appendChild(detailsLink);

    return td;
  }
}


DetailsLinkBuilder.$inject = ['I18n'];
