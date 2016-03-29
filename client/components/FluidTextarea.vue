<style lang="sass">
@import '../scss/_variables';

// IMPORTANT: the pre and textarea elements must have identical margin and padding for the fluid-textarea to behave as required.
// Place margin and padding here:
@mixin margin-padding {
    margin: 0;
    padding: 0;
}

// IMPORTANT: the pre and textarea elements must have identical white-space and word-wrap for the fluid-textarea to behave as required.
@mixin wrap {
    white-space: pre-wrap;
    word-wrap: break-word;
}

.fluid-textarea {
    position: relative;

    > pre {
        font-family: $font-family-sans-serif;
        font-size: 100%;

        &.hidden {
             visibility: hidden;
        }

        @include wrap;
        @include margin-padding;
    }

    > textarea {
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        resize: none;
        @include wrap;
        @include margin-padding;
    }
}
</style>

<template>
    <div class="fluid-textarea">
        <pre class="hidden"><span>{{text}}</span><br/></pre>
        <textarea @input="notify" v-model="text" placeholder="{{placeholder}}">{{value}}</textarea>
    </div>
</template>

<script>
export default {
    name: 'FluidTextarea',

    props: ['value', 'placeholder'],

    data: function() {
        return {
            text: ''
        }
    },

    methods: {
        notify: function() {
            this.$dispatch('new-value', this.text);
            this.text='';
        }
    }
}
</script>
