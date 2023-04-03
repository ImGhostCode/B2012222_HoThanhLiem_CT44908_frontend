<template>
    <div class="page">
        <h4>Thêm liên hệ</h4>
        <ContactForm @submit:contact="addContact" :contact="contact" />
        <p>{{ message }}</p>
    </div>
</template>
<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";
export default {
    components: {
        ContactForm,
    },
    props: {
        // id: { type: String, required: true },
    },
    data() {
        return {
            contact: {},
            message: "",
        };
    },
    methods: {
        async addContact(data) {
            try {
                this.contact = await ContactService.create(data);
                this.message = "Thêm liên hệ thành công";
                setTimeout(() => {
                    this.$router.push({ name: "contactbook" });
                }, 1000);
            } catch (error) {
                console.log(error);
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
            }
        },
    },
    created() {
        this.message = "";
    },
};
</script>