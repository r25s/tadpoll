<template>
   <div class="dynamic-list">
       <div class="item-input">
           <input
                   id="{{pollOptionInputId}}"
                   type="text"
                   class="new-item"
                   placeholder="{{placeholder}}"
                   autocomplete="off"
                   v-model="newItem"
                   @keyup.enter="addItem" />

           <div class="list-button">
               <button class="new" @click="addItem(item)" v-show="this.newItem.length > 0">
               <svg><use xlink:href="/static/images/icons.svg#new"></use></svg>
           </button>
       </div>
       </div>
       <div class="items-list">
           <div v-for="item in items" class="item-pane" @click="editItem(item)" :class="{editing: item == editedItem}">
               <div class="numbering">
                   <span>{{$index+1}}.</span>
               </div>
               <div class="item">
                   <span>{{item.title}}</span>
               </div>
               <div class="list-button">
                   <button class="delete" @click="removeItem(item)">
                       <svg><use xlink:href="/static/images/icons.svg#delete"></use></svg>
                   </button>
               </div>
               <input type="text"
                   class="edit"
                   v-model="item.title"
                   v-focus="item == editedItem"
                   @blur="doneEdit(item)"
                   @keyup.enter="doneEdit(item)"
                   @keyup.esc="cancelEdit(item)" />
           </div>
       </div>
   </div>
</template>

<script type="text/ecmascript-6">
export default {

    name: 'DynamicList',

    props: ['items','pollOptionInputId','placeholder'],

    data: function() {
        return {
//            items: [],
            newItem: '',
            editedItem: null
        }
    },

    methods: {
        addItem: function() {
            var value = this.newItem && this.newItem.trim();
            if (!value) {
                return;
            }
//            this.items.push({title: value});
            this.$dispatch('add', {title: value});
            this.newItem = '';
        },
        removeItem: function(item) {
//            this.items.$remove(item);
            this.$dispatch('remove', item)
        },
        editItem: function(item) {
            this.beforeEditCache = item.title;
            this.editedItem = item;
        },
        doneEdit: function(item) {
            if(!this.editedItem) {
                return;
            }

            this.editedItem = null;

            let title = item.title.trim();

            if(title === this.beforeEditCache) {
                return;
            }

            if(!title) {
                this.removeItem(item);
                return;
            }

            this.$dispatch('edit', item, title);
        },
        cancelEdit: function(item) {
            this.editedItem = null;
            item.title = this.beforeEditCache;
        }
    },

    directives: {
        focus(value) {
            if (value) {
                this.vm.$nextTick(() => {
                    this.el.focus();
                })
            }
        }
    }
}
</script>