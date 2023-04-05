<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>
        <div class="mt-3 col-md-6">
            <h4>
                Danh bạ
                <i class="fas fa-address-book"></i>
            </h4>
            <p>Sắp xếp:
                <span class="mx-4"><input type="checkbox" name="name" id="name" v-model="sortByName"> Tên</span>
                <span class="mx-4"><input type="checkbox" name="favorite" id="favorite" v-model="sortByFavorite"> Yêu
                    thích</span>
            </p>
            <ContactList v-if="renderContactsCount > 0" :contacts="renderContacts" v-model:activeIndex="activeIndex" />
            <p v-else>Không có liên hệ nào.</p>
            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddContact">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllContacts">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
        <div class="mt-3 col-md-6">
            <div v-if="activeContact">
                <h4>
                    Chi tiết Liên hệ
                    <i class="fas fa-address-card"></i>
                </h4>
                <ContactCard :contact="activeContact" />
                <router-link :to="{
                    name: 'contact.edit',
                    params: { id: activeContact._id },
                }">
                    <span class="mt-2 badge badge-warning" style="color: red">
                        <i class="fas fa-edit"></i> Hiệu chỉnh</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";
export default {
    components: {
        ContactCard,
        InputSearch,
        ContactList,
    },
    data() {
        return {
            contacts: [],
            activeIndex: -1,
            searchText: "",
            sortByName: false,
            sortByFavorite: false,
            renderContact: []
        };
    },
    watch: {
        // Giám sát các thay đổi của biến searchText.
        // Bỏ chọn phần tử đang được chọn trong danh sách.
        searchText() {
            this.activeIndex = -1;
        },
        sortByName() {
            console.log(this.sortByName);
        },
        sortByFavorite() {
            console.log(this.sortByFavorite);
        }

    },
    computed: {
        // Chuyển các đối tượng contact thành chuỗi để tiện cho tìm kiếm.
        contactStrings() {
            return this.contacts.map((contact) => {
                const { name, email, address, phone } = contact;
                return [name, email, address, phone].join("");
            });
        },
        // Trả về các contact có chứa thông tin cần tìm kiếm và đã được sắp xếp.
        renderContacts() {
            let resultSearch = [...this.contacts]
            if (this.searchText) {
                resultSearch = this.contacts.filter((_contact, index) =>
                    this.contactStrings[index].includes(this.searchText))
            }

            let resutlSort = [...resultSearch]
            if (this.sortByName) {
                resutlSort.sort((a, b) => {
                    const lastNameA = a.name.split(' ').slice(-1).join(' ')
                    const lastNameB = b.name.split(' ').slice(-1).join(' ')
                    return lastNameA > lastNameB
                })

            }
            if (this.sortByFavorite) {
                resutlSort = resutlSort.filter((_contact, id) => {
                    return _contact.favorite === true
                })
            }

            return resutlSort
        },
        sortContacts() {

        },
        activeContact() {
            if (this.activeIndex < 0) return null;
            return this.renderContacts[this.activeIndex];
        },
        renderContactsCount() {
            return this.renderContacts.length;
        },
    },
    methods: {
        async retrieveContacts() {
            try {
                this.contacts = await ContactService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveContacts();
            this.activeIndex = -1;
        },
        async removeAllContacts() {
            if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
                try {
                    await ContactService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddContact() {
            this.$router.push({ name: "contact.add" });
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>
<style scoped>
.page {
    text-align: left;
    max-width: 750px;
}
</style>