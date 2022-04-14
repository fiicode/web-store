import Database from "@ioc:Adonis/Lucid/Database";
import CurrentStore from "App/Models/CurrentStore";
import Customer from "App/Models/Customer";
import Link from "App/Models/Link";
import Phone from "App/Models/Phone";
import Store from "App/Models/Store";
import Deliverer from 'App/Models/Deliverer';
import Invoice from "App/Models/Invoice";
import Item from "App/Models/Item";
import List from "App/Models/List";
import Log from '../Models/Log';
import Navigation from "App/Models/Navigation";
import Option from 'App/Models/Option';
import Storie from "App/Models/Storie";
import Supplier from "App/Models/Supplier";

/**
 * Store
 * @param id
 * @returns
 */
const get_store = (id) => id ? Store.query().where('id', id).first() : []
export const get_store_user_in = async (auth, storeId) => get_store((await Link.query().where('user_from_to_id', auth.user.id).where('store_id', storeId).first())?.storeId)

/**
 * Auth user store
 * @param auth
 * @returns
 */
export const current_store = async (auth) => (await CurrentStore.query().where('user_id', auth.user.id).orderBy('id', 'desc').first())?.storeId

/**
 * check value is numeric
 * @param str
 * @returns
 */
export function isNumeric(str) {
  if (typeof str != "string") return false
  // return !isNaN(str) && !isNaN(parseFloat(str))
  return !isNaN(parseFloat(str))
}

/**
 * Analyzing and decide to create, edit or not
 * @param old system value existing
 * @param recent user value
 * @param compare system value based for filter global
 * @returns
 */

export function fs_creatOrEditElement(old?: string | undefined, recent?: string | undefined, compare?: string) : boolean {
  recent = isNumeric(recent) ? recent : recent?.toLowerCase()
  compare = isNumeric(compare) ? compare : compare?.toLowerCase()
  // Cas d'une recherche qui n'existait pas dans le systéme et initialisé une valeur
  if (!old && !isNumeric(recent) && !isNumeric(compare) && (typeof recent !== 'undefined' && recent.length > 3 && evaluation(recent, compare))) return true
  // Cas d'une recherche puis trouvé et modifié
  if ((old !== recent) && !isNumeric(recent) && !isNumeric(compare) && (typeof recent !== 'undefined' && recent.length > 3 && compare?.search(recent) === -1)) return true
  // Cas d'une recherche en numérique
  if (!old && isNumeric(recent) && isNumeric(compare) && evaluation(recent, compare)) return true
  // console.log('fs_creatOrEditElement execute')
  return false
}

/**
 *
 * @param recent user value
 * @param compare system value existing
 * @returns
 */
function evaluation(recent?: string | undefined, compare?: string): boolean {
  const c = compare?.split(" ")
  const r = recent?.split(" ")
  let foundIndex = 0;
  let foundSearch = 0

  // Recherch processing
  if (typeof r === "object") {
    r?.map((m) => {
      if (compare?.search(m) !== -1) foundSearch++
      if (c?.indexOf(m) !== -1) foundIndex++
    })
  }

  // response result initilization
  let res = false

  // Cases processing
  if (!r || !c || !recent) return false
  if ((r.length > c.length && foundIndex >= c.length) || (r.length > c.length && foundSearch >= c.length)) res = true
  if (r.length < c.length && (r.length === foundSearch && foundSearch === foundIndex && (recent.length > 7 || ((c.length - r.length) >= 2)))) res = true
  if (r.length > foundIndex && foundIndex === foundSearch) res = true
  if (r.length > foundSearch && foundSearch > foundIndex) res = true
  if (foundSearch === foundIndex && foundIndex === 0 && recent.length > 3) res = true
  // Cas d'une recherche en numérique
  if (isNumeric(recent) && isNumeric(compare) && recent !== compare && (compare?.split('').length === recent?.split('').length)) res = true
  return res
}

// ------- LOCAL DATA FUNCTION ----------

/**
 * Recupération de l'utitlisateur par auth ID
 * @param auth
 * @returns
 */
 export const get_user_info = async (auth) => await Database.from('users').select('id', 'active', 'email', 'avatar', 'created_at', 'updated_at', 'deleted_at').where('id', auth.user.id)

 /**
  * Recupération des utitlisateur appartenant aux memes boutiques
  * @param auth
  * @returns
  */
 export const get_user_friends = async (auth) => {
  const stores_id = await get_user_stores_id(auth);
  const user_friends = await Link.query().whereNull('customerId').whereNull('optionId').whereNull('delivererId').whereNull('phoneId').whereNull('supplierId').whereNull('role_id').whereNull('deletedAt').whereIn('storeId', stores_id).preload('store')
  return user_friends.map((l) => l.$attributes)
 }

/**
 * Recupération des boutiques de l'utitlisateur (CREEE)
 * @param auth
 * @returns
 */
  export const get_user_stores = async (auth) => {
    const user_stores = await Store.query().where('user_id', auth.user.id)
    const user_link_stores = await Link.query().whereNull('customerId').whereNull('optionId').whereNull('delivererId').whereNull('phoneId').whereNull('supplierId').whereNull('role_id').whereNull('deletedAt').where('user_from_to_id', auth?.user?.id).preload('store')
    const links = user_link_stores.map((s) => s.store)
    return [...user_stores, ...links]
  }

 /**
  * Recupération de ID des boutique de l'utitlisateur
  * @param auth
  * @returns
  */
 export const get_user_stores_id = async (auth) => {
   const user_stores = await get_user_stores(auth);
   let stores = Array();

   user_stores?.map((s) => stores = [...stores, s.id]);

   return stores;
 }

 /**
  * Recupération des numero de telephone pour les boutiques de l'utitlisateur
  * @param auth
  * @returns
  */
 export const get_user_phones_stores = async (auth) => await Phone.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

 /**
  * Recupération de la boutique courant de l'utitlisateur
  * @param auth
  * @returns
  */
 export const get_user_current_stores = async (auth) => await CurrentStore.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
 * Recupération des clients pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_customers_stores = async (auth) => await Customer.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
* Recupération des livreurs pour les boutiques de l'utitlisateur
* @param auth
* @returns
*/
export const get_user_deliverers_stores = async (auth) => await Deliverer.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
* Recupération des factures pour les boutiques de l'utitlisateur
* @param auth
* @returns
*/
export const get_user_invoices_stores = async (auth) => await Invoice.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
* Recupération des articles pour les boutiques de l'utitlisateur
* @param auth
* @returns
*/
export const get_user_items_stores = async (auth) => await Item.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
 * Recupération des liens pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_links_stores = async (auth) => await Link.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
 * Recupération des listes pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_lists_stores = async (auth) => await List.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
 * Recupération des logs pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_logs_stores = async (auth) => await Log.query().whereIn('store_id', await get_user_stores_id(auth))

/**
 * Recupération des navitions pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_navigations_stores = async (auth) => await Navigation.query().whereIn('store_id', await get_user_stores_id(auth))

/**
 * Recupération des options pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_options_stores = async (auth) => await Option.query().whereIn('store_id', await get_user_stores_id(auth)).whereNull('deletedAt');

/**
 * Recupération des commandes pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_orders_stores = async (auth) => await auth.user.id

/**
 * Recupération des roles pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_roles_stores = async (auth) => await auth.user.id

/**
 * Recupération des historiques pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
export const get_user_stories_stores = async (auth) => await Storie.query().whereIn('store_id', await get_user_stores_id(auth)).whereNull('deleted_at');

/**
 * Recupération des fournisseurs pour les boutiques de l'utitlisateur
 * @param auth
 * @returns
 */
 export const get_user_suppliers_stores = async (auth) => await Supplier.query().whereIn('storeId', await get_user_stores_id(auth)).whereNull('deletedAt');


 // ----- END LOCAL DATA FUNCTION ------
