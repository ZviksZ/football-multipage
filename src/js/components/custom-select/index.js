import * as $ from 'jquery';
import Choices from 'choices.js';

export class CustomSelect {
   constructor() {
      this.$select = $('select.custom-select');
      if (this.$select.length > 0) {
         this.init();
      }
   }
   init = () => {
      this.$select.each((_, item) => this.initChoices(item));

   };

   initChoices = (
      $element,
      options = {
         searchEnabled: false,
         searchChoices: false,
         removeItems: true,
         itemSelectText: '',
         /*renderSelectedChoices: 'always',*/
         classNames: {
            containerOuter: 'choices choices-custom',
         },
         noChoicesText: 'No choices to choose from',
         sorter: function(a, b) {
            return +b.value - +a.value;
         },
      }
   ) => {
      if (!$element) return;

      let iconsObj = {};

      if ($($element).find('[data-icon]').length > 0) {
         options = {
            ...options,
            classNames: {
               containerOuter: 'choices choices-custom choices-custom-with-icons',
            },
            callbackOnCreateTemplates: function (strToEl) {
               let classNames = this.config.classNames;
               let itemSelectText = this.config.itemSelectText;
               return {
                  item: function (classNames, data) {
                     let icon = $($element)
                        .find('option[value="' + data.value + '"')
                        .attr('data-icon');

                     if (icon) {
                        iconsObj[data.value] = icon;
                     }
                     let isIcon = iconsObj[data.value] ? '<img src="' + iconsObj[data.value] + '" alt="" class="select-icon" style="margin-right:10px;">' : '';

                     return strToEl(
                        `
                           <div 
                           class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}"
                           data-item
                           data-choice="${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'}"
                           data-id="${data.id}"
                           data-value="${data.value}"
                           ${data.active ? 'aria-selected="true"' : ''}
                           ${data.disabled ? 'aria-disabled="true"' : ''}
                           >
                              ${isIcon}
                              ${data.label}                           
                           </div>                            
                        `
                     );
                  },
                  choice: function (classNames, data) {
                     let icon = $($element)
                        .find('option[value="' + data.value + '"')
                        .attr('data-icon');
                     if (icon) {
                        iconsObj[data.value] = icon;
                     }
                     let isActive = data.selected ? 'aria-selected="true"' : '';
                     let isIcon = iconsObj[data.value] ? '<img src="' + iconsObj[data.value] + '" alt="" class="select-icon" style="margin-right:10px;">' : '';

                     return strToEl(
                        `
                           <div 
                           class="${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}"
                           data-select-text="${itemSelectText}"
                           data-choice="${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'}"
                           data-id="${data.id}"
                           data-value="${data.value}"
                           ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}
                           ${isActive}
                           >
                              ${isIcon}
                              ${data.label}                           
                           </div>                            
                        `
                     );
                  },
               };
            },
         };
      }

      if ($($element).attr('multiple')) {
         options = {
            ...options,
            removeItemButton: true,
         };
      }

      let choice = new Choices($element, options);

   };
}
