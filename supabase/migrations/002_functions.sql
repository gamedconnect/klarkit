-- Helper function to increment download count
create or replace function increment_download_count(product_id uuid, amount int default 1)
returns void as $$
begin
  update products
  set download_count = download_count + amount
  where id = product_id;
end;
$$ language plpgsql security definer;

-- Helper function to increment coupon usage
create or replace function increment_coupon_usage(coupon_id uuid)
returns void as $$
begin
  update coupons
  set used_count = used_count + 1
  where id = coupon_id;
end;
$$ language plpgsql security definer;

-- View for product ratings
create or replace view product_ratings as
select
  product_id,
  round(avg(rating)::numeric, 1) as average_rating,
  count(*) as review_count
from reviews
group by product_id;
