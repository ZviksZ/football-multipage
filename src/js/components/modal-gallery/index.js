import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min.js';

export class ModalGallery {
   constructor() {
      this.$gallery = $('#photos');

      if (!this.$gallery.length) return false;

      this.$slider = $('#gallery-modal-slider');
      this.$captionBlock = $('#gallery-photo-caption');

      this.init();
   }

   init = () => {
      this.initModalItems();
      this.initModalSlider();
      this.initSlideTo();
   };

   initSlideTo = () => {
      this.$gallery.find('.photo').on('click', (e) => {

         let slide = +$(e.currentTarget).attr('data-slide');
         let caption = $(e.currentTarget).attr('data-caption');

         this.$sliderInstance.slideTo(slide, 10, true);

         this.$captionBlock.text(caption);
         setTimeout(() => {
            this.$sliderInstance.update();
         }, 10);
      });
   };

   initModalItems = () => {
      let template = ``;

      this.$gallery.find('.photo').each((index, item) => {
         let img = item.dataset.photo;
         let caption = item.dataset.caption;

         template += this.getModalItemTemplate(img, caption);
      });

      this.$slider.find('.swiper-wrapper').html(template);
   };

   getModalItemTemplate = (image, caption) => {
      return `
         <div class="swiper-slide" data-caption="${caption}" style="background-image: url('${image}')">
                
         </div>
      `;
   };

   initModalSlider = () => {
      this.$sliderInstance = new Swiper(this.$slider, {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: false,
         slidesPerView: 1,
         autoHeight: true,
         spaceBetween: 0,
         pagination: {
            el: '#gallery-modal .swiper-pagination',
            type: 'fraction',
            renderFraction: function (currentClass, totalClass, index) {
               return `<span class="swiper-pagination-current"></span> of <span class="swiper-pagination-total"></span>`;
            },
         },
         on: {
            slideChange: () => {
               let currentSlide = this.$slider.find('.swiper-slide')[this.$sliderInstance.activeIndex];
               let currentCaption = $(currentSlide).attr('data-caption');

               this.$captionBlock.text(currentCaption);
            },
         },
      });
   };
}
