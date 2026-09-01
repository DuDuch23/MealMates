import { Link } from "react-router"
import { API_BASE_URL } from "../services/apiClient"

export default function OfferCard({ offer }) {
  return (
    <Link
      to={`/offer/${offer.id}`}
      className="flex h-full flex-col gap-2 overflow-hidden rounded-2xl bg-surface-raised shadow-md transition-transform hover:-translate-y-1"
    >
      {offer.images?.length > 0 && (
        <img
          src={`${API_BASE_URL}${offer.images[0].url}`}
          alt={offer.product}
          className="h-40 w-full rounded-t-2xl object-cover md:h-52 lg:h-60"
        />
      )}

      <div className="flex grow flex-col gap-2 p-3">
        <h3 className="text-lg font-bold text-white md:text-xl">{offer.product}</h3>

        {offer.categories?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {offer.categories.map((category) => (
              <li
                key={category.id}
                className="rounded-full bg-primary-dark px-3 py-0.5 text-xs text-white"
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}

        <p className="font-semibold text-primary">
          {offer.price > 0 ? `${offer.price} €` : "Don"}
        </p>

        <div className="mt-auto flex items-center justify-between text-sm text-gray-300">
          <span>
            {offer.seller.firstName} {offer.seller.lastName}
          </span>
        </div>
      </div>
    </Link>
  )
}
