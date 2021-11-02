import CurrentStore from "App/Models/CurrentStore";
import Link from "App/Models/Link";
import Store from "App/Models/Store";

const get_store = (id) => id ? Store.query().where('id', id).first() : []
export const current_store = async (auth) => (await CurrentStore.query().where('user_id', auth.user.id).orderBy('id', 'desc').first())?.storeId
export const get_store_user_in = async (auth, storeId) => get_store((await Link.query().where('user_from_to_id', auth.user.id).where('store_id', storeId).first())?.storeId)
