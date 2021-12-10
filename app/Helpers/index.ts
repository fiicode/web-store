import CurrentStore from "App/Models/CurrentStore";
import Link from "App/Models/Link";
import Store from "App/Models/Store";

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
  return !isNaN(str) && !isNaN(parseFloat(str))
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
